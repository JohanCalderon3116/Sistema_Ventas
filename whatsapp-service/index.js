import express from "express";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import pino from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.WHATSAPP_API_KEY || "softcreate-pos-secret-2026";
const SUPABASE_FUNCTION_URL =
  process.env.SUPABASE_FUNCTION_URL ||
  "https://nqtnayrpmamynxzogkne.supabase.co/functions/v1/enviar-facturas";
const AUTH_FOLDER = path.join(__dirname, "auth_info_baileys");
const HISTORIAL_FILE = path.join(__dirname, "historial_envios.json");

const DIAS_PROGRAMADOS = [22, 26, 28];
const HORA_MINIMA_BOGOTA = 8;

const app = express();
app.use(express.json({ limit: "25mb" }));

let sock = null;
let qrDataUrl = null;
let connectionStatus = "connecting";
let connectedPhone = null;
let enviandoEnCurso = false;

function obtenerFechaHoraBogota() {
  const ahora = new Date();
  const bogota = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
  const yyyy = bogota.getUTCFullYear();
  const mm = String(bogota.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(bogota.getUTCDate()).padStart(2, "0");
  const hora = bogota.getUTCHours();
  const minuto = String(bogota.getUTCMinutes()).padStart(2, "0");
  return {
    fechaStr: `${yyyy}-${mm}-${dd}`,
    dia: bogota.getUTCDate(),
    hora,
    horaFormateada: `${String(hora).padStart(2, "0")}:${minuto}`,
  };
}

function leerHistorial() {
  try {
    if (fs.existsSync(HISTORIAL_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORIAL_FILE, "utf8"));
    }
  } catch (_e) {}
  return { fechasEnviadas: {}, ultimoEnvio: null, historial: [] };
}

function guardarHistorial(data) {
  try {
    fs.writeFileSync(HISTORIAL_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("[Historial] Error guardando historial:", e.message);
  }
}

function normalizarJid(telefonoRaw) {
  if (!telefonoRaw) return null;
  let digits = String(telefonoRaw).replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.length === 10 && digits.startsWith("3")) {
    digits = `57${digits}`;
  }
  return `${digits}@s.whatsapp.net`;
}

async function enviarPdfPorWhatsApp({
  telefono,
  mensaje,
  pdfBase64,
  nombreArchivo,
}) {
  if (!sock || connectionStatus !== "connected") {
    throw new Error("WhatsApp no esta conectado. Escanea primero el codigo QR.");
  }
  const jid = normalizarJid(telefono);
  if (!jid) {
    throw new Error(`Numero de telefono invalido: ${telefono}`);
  }
  const cleanBase64 = String(pdfBase64).replace(
    /^data:application\/pdf;base64,/,
    "",
  );
  const buffer = Buffer.from(cleanBase64, "base64");

  await sock.sendMessage(jid, {
    document: buffer,
    mimetype: "application/pdf",
    fileName: nombreArchivo || "Factura_SoftCreate.pdf",
    caption: mensaje || "",
  });

  return jid.split("@")[0];
}

async function ejecutarEnvioFacturas({
  omitirCorreo = false,
  telefonoPrueba = "",
  forzarCorreo = false,
  origen = "AUTOMATICO",
} = {}) {
  if (enviandoEnCurso) {
    throw new Error("Ya hay un envio de facturas en curso.");
  }
  if (connectionStatus !== "connected") {
    throw new Error("WhatsApp no esta conectado.");
  }

  enviandoEnCurso = true;
  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incluir_whatsapp_payload: true,
        omitir_correo: Boolean(omitirCorreo),
        forzar_correo: Boolean(forzarCorreo),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error desde Supabase: ${errText}`);
    }

    const data = await response.json();
    const facturas = Array.isArray(data?.facturas) ? data.facturas : [];
    const resultados = [];

    for (const item of facturas) {
      const destinoTel = String(telefonoPrueba || item.telefono || "").trim();
      let whatsappEnviado = false;
      let whatsappDetalle = "Sin telefono de 10 digitos en la BD";

      if (destinoTel && item.pdfBase64) {
        try {
          const enviadoA = await enviarPdfPorWhatsApp({
            telefono: destinoTel,
            mensaje: item.mensajeWhatsapp,
            pdfBase64: item.pdfBase64,
            nombreArchivo: item.nombreArchivo,
          });
          whatsappEnviado = true;
          whatsappDetalle = `Enviado a +${enviadoA}`;
          await new Promise((r) => setTimeout(r, 1200));
        } catch (err) {
          whatsappDetalle = `Error: ${err.message}`;
        }
      }

      resultados.push({
        empresa: item.empresa,
        correo: item.correo,
        telefono: destinoTel || "No registrado",
        esMesGratis: item.esMesGratis,
        tarifaCalculada: item.tarifaCalculada,
        totalAPagar: item.totalAPagar,
        correoEnviado: item.correoEnviado,
        whatsappEnviado,
        whatsappDetalle,
      });
    }

    const { fechaStr, horaFormateada } = obtenerFechaHoraBogota();
    const hist = leerHistorial();
    if (!telefonoPrueba) {
      hist.fechasEnviadas[fechaStr] = true;
    }
    const registro = {
      fecha: `${fechaStr} ${horaFormateada}`,
      origen,
      totalEmpresas: resultados.length,
      enviadosWhatsapp: resultados.filter((r) => r.whatsappEnviado).length,
      resultados,
    };
    hist.ultimoEnvio = registro;
    hist.historial = [registro, ...(hist.historial || []).slice(0, 14)];
    guardarHistorial(hist);

    console.log(
      `[Facturacion ${origen}] Completado (${fechaStr}): ${registro.enviadosWhatsapp}/${registro.totalEmpresas} enviados por WhatsApp.`,
    );
    return resultados;
  } finally {
    enviandoEnCurso = false;
  }
}

async function verificarCronAutomatico() {
  try {
    if (connectionStatus !== "connected" || enviandoEnCurso) return;
    const { fechaStr, dia, hora } = obtenerFechaHoraBogota();

    if (!DIAS_PROGRAMADOS.includes(dia)) return;
    if (hora < HORA_MINIMA_BOGOTA) return;

    const hist = leerHistorial();
    if (hist.fechasEnviadas && hist.fechasEnviadas[fechaStr]) {
      return;
    }

    console.log(
      `[Cron Automatico] Hoy es dia ${dia} (${fechaStr}). Iniciando envio automatico de recordatorio y factura por Correo + WhatsApp...`,
    );
    await ejecutarEnvioFacturas({
      omitirCorreo: false,
      origen: `AUTOMATICO DÍA ${dia}`,
    });
  } catch (err) {
    console.error("[Cron Automatico] Error:", err.message);
  }
}

async function iniciarWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  let version = [2, 3000, 1015901307];
  try {
    const latest = await fetchLatestBaileysVersion();
    version = latest.version;
  } catch (_e) {}

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: "silent" }),
    browser: ["SoftCreate POS Facturacion", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionStatus = "qr";
      qrDataUrl = await QRCode.toDataURL(qr, { width: 280, margin: 2 });
      console.log(
        `[WhatsApp] Escanea el codigo QR en http://localhost:${PORT}`,
      );
    }

    if (connection === "open") {
      connectionStatus = "connected";
      qrDataUrl = null;
      connectedPhone = sock?.user?.id
        ? sock.user.id.split(":")[0].split("@")[0]
        : "Vinculado";
      console.log(`[WhatsApp] Conectado exitosamente (+${connectedPhone})`);
      setTimeout(() => verificarCronAutomatico(), 4000);
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      connectionStatus = "disconnected";
      connectedPhone = null;
      qrDataUrl = null;

      if (loggedOut) {
        console.log("[WhatsApp] Sesion cerrada. Limpiando credenciales...");
        try {
          fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
        } catch (_e) {}
      }
      setTimeout(() => iniciarWhatsApp(), 2500);
    }
  });
}

setInterval(() => {
  verificarCronAutomatico();
}, 5 * 60 * 1000);

app.get("/estado", (_req, res) => {
  const { fechaStr, dia } = obtenerFechaHoraBogota();
  const hist = leerHistorial();
  res.json({
    status: connectionStatus,
    connectedPhone,
    qrDataUrl,
    diasProgramados: DIAS_PROGRAMADOS,
    fechaActualBogota: fechaStr,
    diaActualBogota: dia,
    enviadoHoy: Boolean(hist?.fechasEnviadas?.[fechaStr]),
    ultimoEnvio: hist?.ultimoEnvio || null,
  });
});

app.post("/desvincular", async (_req, res) => {
  try {
    if (sock) {
      await sock.logout();
    }
  } catch (_e) {}
  try {
    fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
  } catch (_e) {}
  connectionStatus = "connecting";
  connectedPhone = null;
  qrDataUrl = null;
  setTimeout(() => iniciarWhatsApp(), 1000);
  res.json({ ok: true });
});

app.post("/enviar-factura", async (req, res) => {
  try {
    const keyHeader = req.headers["x-api-key"];
    if (API_KEY && keyHeader && keyHeader !== API_KEY) {
      return res.status(401).json({ error: "API Key no autorizada" });
    }
    const { telefono, mensaje, pdfBase64, nombreArchivo } = req.body || {};
    if (!telefono || !pdfBase64) {
      return res
        .status(400)
        .json({ error: "Faltan campos requeridos (telefono, pdfBase64)" });
    }
    const numeroDestino = await enviarPdfPorWhatsApp({
      telefono,
      mensaje,
      pdfBase64,
      nombreArchivo,
    });
    return res.json({ ok: true, enviadoA: `+${numeroDestino}` });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Error enviando PDF" });
  }
});

app.post("/disparar-facturacion", async (req, res) => {
  try {
    const { omitirCorreo = false, telefonoPrueba = "" } = req.body || {};
    const resultados = await ejecutarEnvioFacturas({
      omitirCorreo,
      telefonoPrueba,
      forzarCorreo: !omitirCorreo,
      origen: "PRUEBA MANUAL",
    });
    return res.json({
      ok: true,
      resultados,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Error procesando facturacion" });
  }
});

app.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SoftCreate POS — Facturación Automática (Días 22, 26 y 28)</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #09090b;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 36px 16px;
    }
    .container {
      width: min(880px, 100%);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .card {
      background: #121216;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
    }
    .badge.connected {
      background: rgba(16, 185, 129, 0.14);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .badge.waiting {
      background: rgba(245, 158, 11, 0.14);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: currentColor;
    }
    .schedule-banner {
      margin-top: 16px;
      padding: 16px 18px;
      border-radius: 12px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.28);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .schedule-banner strong {
      color: #10b981;
      font-size: 15px;
    }
    .schedule-banner span {
      color: #cbd5e1;
      font-size: 13.5px;
      line-height: 1.5;
    }
    .qr-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
      padding: 14px 0 4px;
    }
    .qr-box img {
      border-radius: 14px;
      border: 4px solid #ffffff;
      background: #ffffff;
      width: 260px;
      height: 260px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;
    }
    button {
      padding: 11px 18px;
      border-radius: 12px;
      border: none;
      font-weight: 700;
      font-size: 13.5px;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .btn-primary {
      background: #10b981;
      color: #ffffff;
    }
    .btn-secondary {
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.14);
    }
    .btn-danger {
      background: rgba(239, 68, 68, 0.14);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 13.5px;
    }
    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      text-align: left;
    }
    th {
      color: #94a3b8;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
    }
    .ok { color: #10b981; font-weight: 700; }
    .warn { color: #f59e0b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div>
          <h1>SoftCreate POS — Facturación 100% Automática</h1>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">
            Envío automático por Correo Electrónico y WhatsApp sin intervención manual.
          </p>
        </div>
        <div id="statusBadge" class="badge waiting">
          <span class="dot"></span>
          <span id="statusText">Verificando conexión...</span>
        </div>
      </div>

      <div class="schedule-banner">
        <strong>🗓️ Programador Automático Activo: Días 22, 26 y 28 de cada mes</strong>
        <span>
          No tienes que presionar ningún botón. Los días <strong>22, 26 y 28</strong> el sistema consulta automáticamente todas las empresas de la base de datos, calcula su tarifa ($150.000 a $250.000 COP, o $0 COP en su primer mes gratis) y envía el recordatorio con la factura PDF a su <strong>Correo</strong> y a su <strong>WhatsApp</strong> registrado.
        </span>
      </div>

      <div id="qrSection" class="qr-box"></div>
    </div>

    <div class="card">
      <h2 style="margin: 0 0 8px; font-size: 17px;">Estado del Último Envío y Controles Opcionales</h2>
      <div id="ultimoEnvioInfo" style="color: #94a3b8; font-size: 13.5px;"></div>

      <div class="actions">
        <button id="btnAmbos" class="btn-primary" onclick="disparar(false)">
          ⚡ Ejecutar Envío Ahora (Correo + WhatsApp)
        </button>
        <button id="btnSoloWa" class="btn-secondary" onclick="disparar(true)">
          📱 Probar envío ahora SOLO por WhatsApp
        </button>
        <button class="btn-danger" onclick="desvincular()">
          Cambiar cuenta de WhatsApp
        </button>
      </div>

      <div id="resultadoBox" style="margin-top: 18px;"></div>
    </div>
  </div>

  <script>
    async function actualizarEstado() {
      try {
        const res = await fetch('/estado');
        const data = await res.json();
        const badge = document.getElementById('statusBadge');
        const statusText = document.getElementById('statusText');
        const qrSection = document.getElementById('qrSection');
        const ultimoEnvioInfo = document.getElementById('ultimoEnvioInfo');

        if (data.status === 'connected') {
          badge.className = 'badge connected';
          statusText.textContent = 'WhatsApp En Línea (+' + (data.connectedPhone || '') + ')';
          qrSection.innerHTML = '<p style="color:#10b981;font-weight:700;margin:6px 0 0;">✅ WhatsApp vinculado en segundo plano. Los envíos de los días 22, 26 y 28 se realizarán solos automáticamente.</p>';
        } else if (data.qrDataUrl) {
          badge.className = 'badge waiting';
          statusText.textContent = 'Esperando escaneo de QR';
          qrSection.innerHTML =
            '<img src="' + data.qrDataUrl + '" alt="Código QR WhatsApp" />' +
            '<p style="color:#cbd5e1;font-size:14px;max-width:460px;margin:0;">Abre WhatsApp en tu teléfono ➔ <strong>Dispositivos vinculados</strong> ➔ <strong>Vincular un dispositivo</strong> y escanea este código QR.</p>';
        } else {
          badge.className = 'badge waiting';
          statusText.textContent = 'Conectando...';
          qrSection.innerHTML = '<p style="color:#94a3b8;">Conectando con WhatsApp...</p>';
        }

        if (data.ultimoEnvio) {
          ultimoEnvioInfo.innerHTML = 'Último lote procesado: <strong>' + data.ultimoEnvio.fecha + '</strong> (' + data.ultimoEnvio.origen + ') — ' + data.ultimoEnvio.enviadosWhatsapp + ' WhatsApps enviados.';
        } else {
          ultimoEnvioInfo.innerHTML = 'Esperando el próximo día de corte automático (<strong>22, 26 o 28 del mes</strong>).';
        }
      } catch (e) {}
    }

    async function disparar(omitirCorreo) {
      const btnAmbos = document.getElementById('btnAmbos');
      const btnSoloWa = document.getElementById('btnSoloWa');
      const resultadoBox = document.getElementById('resultadoBox');

      btnAmbos.disabled = true;
      btnSoloWa.disabled = true;
      resultadoBox.innerHTML = '<p style="color:#94a3b8;">⏳ Generando PDFs en Supabase y enviando a los números de las empresas...</p>';

      try {
        const res = await fetch('/disparar-facturacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ omitirCorreo })
        });
        const data = await res.json();
        if (!res.ok) {
          resultadoBox.innerHTML = '<p class="warn">⚠️ ' + (data.error || 'Error al enviar') + '</p>';
        } else {
          let rows = (data.resultados || []).map(r => \`
            <tr>
              <td><strong>\${r.empresa}</strong><br><span style="color:#94a3b8;font-size:12px;">\${r.correo}</span></td>
              <td>\${r.telefono}</td>
              <td>$ \${Number(r.totalAPagar).toLocaleString('es-CO')} COP \${r.esMesGratis ? '<span class="ok">(Mes Gratis)</span>' : ''}</td>
              <td>\${omitirCorreo ? '<span style="color:#94a3b8;">Omitido</span>' : (r.correoEnviado ? '<span class="ok">✔ Enviado</span>' : '<span class="warn">No enviado</span>')}</td>
              <td>\${r.whatsappEnviado ? '<span class="ok">✔ ' + r.whatsappDetalle + '</span>' : '<span class="warn">' + r.whatsappDetalle + '</span>'}</td>
            </tr>
          \`).join('');
          resultadoBox.innerHTML = \`
            <table>
              <thead>
                <tr>
                  <th>Empresa / Correo</th>
                  <th>WhatsApp BD</th>
                  <th>Total Factura</th>
                  <th>Correo</th>
                  <th>WhatsApp PDF</th>
                </tr>
              </thead>
              <tbody>\${rows}</tbody>
            </table>
          \`;
          actualizarEstado();
        }
      } catch (err) {
        resultadoBox.innerHTML = '<p class="warn">⚠️ Error: ' + err.message + '</p>';
      } finally {
        btnAmbos.disabled = false;
        btnSoloWa.disabled = false;
      }
    }

    async function desvincular() {
      if (!confirm('¿Seguro que deseas desvincular la sesión actual de WhatsApp?')) return;
      await fetch('/desvincular', { method: 'POST' });
      actualizarEstado();
    }

    actualizarEstado();
    setInterval(actualizarEstado, 3000);
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(
    `================================================================`,
  );
  console.log(
    `🚀 Servicio Automático WhatsApp SoftCreate POS (Días 22, 26 y 28) activo en: http://localhost:${PORT}`,
  );
  console.log(
    `================================================================`,
  );
  iniciarWhatsApp();
});
