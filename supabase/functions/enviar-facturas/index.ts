import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib";
import { SOFTCREATE_LOGO_PNG_BASE64 } from "./logo.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const MIN_TARIFA_COP = 150000;
const MAX_TARIFA_COP = 250000;
const RANGO_TARIFA_COP = MAX_TARIFA_COP - MIN_TARIFA_COP; // 100.000 COP
const DIAS_MES_GRATIS = 30;

function sanitizePdfText(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[\u00A0\u202F\u2007]/g, " ")
    .replace(/[•·]/g, "-")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E\xA1-\xFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCOP(value: unknown): string {
  const num = Math.round(Number(value) || 0);
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const withThousands = absNum
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${isNegative ? "- " : ""}$ ${withThousands}`;
}

function formatDateOnly(value: unknown): string {
  if (!value) return "No registrada";
  const raw = String(value).trim();
  const d = new Date(raw.includes("T") ? raw : raw.replace(" ", "T"));
  if (isNaN(d.getTime())) return sanitizePdfText(raw);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const subarray = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(subarray));
  }
  return btoa(binary);
}

export interface EmpresaFacturacionData {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  id_fiscal: string;
  fechaCreacionStr: string;
  diasAntiguedad: number;
  esMesGratis: boolean;
  ventasCount: number;
  productosCount: number;
  cierresCount: number;
  sucursalesCount: number;
  cajasCount: number;
  montoTotalVendido: number;
  indiceConsumoPct: number;
  nivelFlujo: string;
  tarifaMensualCalculada: number;
  descuentoMesGratis: number;
  totalAPagar: number;
}

export function normalizarTelefonoWhatsapp(raw: unknown): string {
  if (!raw || raw === "-") return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length < 10) return "";
  if (digits.length === 10 && digits.startsWith("3")) {
    return `57${digits}`;
  }
  return digits;
}

export function obtenerDiaColombia(fecha = new Date()): {
  fechaBogotaStr: string;
  diaMes: number;
} {
  const bogotaTime = new Date(fecha.getTime() - 5 * 60 * 60 * 1000);
  const yyyy = bogotaTime.getUTCFullYear();
  const mm = String(bogotaTime.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(bogotaTime.getUTCDate()).padStart(2, "0");
  return {
    fechaBogotaStr: `${yyyy}-${mm}-${dd}`,
    diaMes: bogotaTime.getUTCDate(),
  };
}

export function construirMensajeWhatsapp(
  emp: EmpresaFacturacionData,
  diaMes = 22,
): string {
  const etiquetaRecordatorio =
    diaMes === 28
      ? "⏰ *ÚLTIMO RECORDATORIO DE PAGO (VENCE EL DÍA 1)*"
      : diaMes === 26
        ? "🔔 *SEGUNDO RECORDATORIO DE FACTURACIÓN MENSUAL*"
        : "📅 *RECORDATORIO DE FACTURACIÓN MENSUAL (DÍA 22)*";

  if (emp.esMesGratis) {
    return [
      "*SOFTCREATE POS — FACTURA DE SUSCRIPCIÓN* 📄✨",
      "",
      `Hola, *${emp.nombre}* 👋`,
      "¡Gracias por confiar en *SoftCreate POS*! Adjuntamos en PDF el soporte de tu suscripción mensual.",
      "",
      "🎁 *BENEFICIO PRIMER MES GRATIS:*",
      `Como tu empresa fue registrada recientemente (${emp.fechaCreacionStr}), *este primer mes es 100% GRATIS*.`,
      "",
      `• Valor mensualidad (${emp.nivelFlujo}): ${formatCOP(emp.tarifaMensualCalculada)} COP`,
      `• Descuento de bienvenida (-100%): - ${formatCOP(emp.descuentoMesGratis)} COP`,
      "• *TOTAL A PAGAR ESTE MES: $ 0 COP* ✅",
      "",
      `📊 *Actividad registrada:* ${emp.ventasCount} ventas | ${emp.productosCount} productos | ${emp.cierresCount} turnos de caja.`,
    ].join("\n");
  }

  return [
    "*SOFTCREATE POS — FACTURA Y RECORDATORIO DE PAGO* 📄",
    etiquetaRecordatorio,
    "",
    `Hola, *${emp.nombre}* 👋`,
    "Te recordamos el pago de la mensualidad de tu sistema *SoftCreate POS*. Adjuntamos en PDF tu factura actualizada según el flujo operativo de tu negocio.",
    "",
    "💰 *RESUMEN DE COBRO:*",
    `• Nivel de actividad: ${emp.nivelFlujo}`,
    `• *TOTAL A PAGAR: ${formatCOP(emp.totalAPagar)} COP*`,
    "• Fecha límite de pago: Día 1 del mes",
    "",
    `📊 *Actividad registrada:* ${emp.ventasCount} ventas | ${emp.productosCount} productos | ${emp.cierresCount} turnos de caja.`,
    "",
    "🏦 *MEDIOS DE PAGO AUTORIZADOS:*",
    "• *Nequi:* 3116025328",
    "• *Efectivo:* Pago presencial (entrega personal)",
    "",
    "_Una vez realizado el pago, por favor envíanos el comprobante por este mismo chat para registrar tu abono inmediatamente._ ¡Gracias por preferirnos! 🚀",
  ].join("\n");
}

export function calcularFacturacionEmpresas(
  empresasRaw: any[],
  ventasAll: any[],
  productosAll: any[],
  sucursalesAll: any[],
  fechaReferencia = new Date(),
): EmpresaFacturacionData[] {
  // 1. Recolectar métricas crudas por empresa
  const metricasIniciales = empresasRaw.map((emp) => {
    const idEmp = Number(emp.id);
    const ventasEmp = ventasAll.filter(
      (v) => Number(v.id_empresa) === idEmp && v.estado !== "pendiente",
    );
    const productosEmp = productosAll.filter(
      (p) => Number(p.id_empresa) === idEmp,
    );
    const sucursalesEmp = sucursalesAll.filter(
      (s) => Number(s.id_empresa) === idEmp,
    );
    const cajasEmp = sucursalesEmp.flatMap((s) =>
      Array.isArray(s.caja) ? s.caja : [],
    );
    const cierresEmp = cajasEmp.flatMap((c) =>
      Array.isArray(c.cierrecaja) ? c.cierrecaja : [],
    );

    const montoTotalVendido = ventasEmp.reduce(
      (acc, v) => acc + (Number(v.monto_total) || 0),
      0,
    );

    // Determinar fecha de creación más antigua confiable (caja.fecha_creacion, primer cierre o primera venta)
    const fechasCandidatas: number[] = [];
    for (const c of cajasEmp) {
      if (c?.fecha_creacion) {
        const t = new Date(c.fecha_creacion).getTime();
        if (!isNaN(t)) fechasCandidatas.push(t);
      }
    }
    for (const ci of cierresEmp) {
      if (ci?.fechainicio) {
        const t = new Date(
          String(ci.fechainicio).includes("T")
            ? ci.fechainicio
            : String(ci.fechainicio).replace(" ", "T"),
        ).getTime();
        if (!isNaN(t)) fechasCandidatas.push(t);
      }
    }
    for (const v of ventasEmp) {
      if (v?.fecha) {
        const t = new Date(
          String(v.fecha).includes("T")
            ? v.fecha
            : String(v.fecha).replace(" ", "T"),
        ).getTime();
        if (!isNaN(t)) fechasCandidatas.push(t);
      }
    }

    const minTimestamp =
      fechasCandidatas.length > 0
        ? Math.min(...fechasCandidatas)
        : fechaReferencia.getTime();
    const fechaCreacionDate = new Date(minTimestamp);
    const diffMs = Math.max(0, fechaReferencia.getTime() - minTimestamp);
    const diasAntiguedad = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const esMesGratis = diasAntiguedad < DIAS_MES_GRATIS;

    // Extraer teléfono de la empresa o, como respaldo, del usuario asignado a la sucursal
    let telefonoCandidato = normalizarTelefonoWhatsapp(emp.telefono_celular);
    if (!telefonoCandidato) {
      for (const s of sucursalesEmp) {
        const asignaciones = Array.isArray(s.asignacion_sucursal)
          ? s.asignacion_sucursal
          : [];
        for (const asig of asignaciones) {
          const telUser = normalizarTelefonoWhatsapp(asig?.usuarios?.telefono);
          if (telUser) {
            telefonoCandidato = telUser;
            break;
          }
        }
        if (telefonoCandidato) break;
      }
    }

    return {
      id: idEmp,
      nombre: emp.nombre || "Empresa Registrada",
      correo: emp.correo,
      telefono: telefonoCandidato,
      id_fiscal: emp.id_fiscal || "Consumidor Final",
      fechaCreacionStr: formatDateOnly(fechaCreacionDate.toISOString()),
      diasAntiguedad,
      esMesGratis,
      ventasCount: ventasEmp.length,
      productosCount: productosEmp.length,
      cierresCount: cierresEmp.length,
      sucursalesCount: Math.max(1, sucursalesEmp.length),
      cajasCount: Math.max(1, cajasEmp.length),
      montoTotalVendido,
    };
  });

  // 2. Obtener los máximos reales del ecosistema (con pisos mínimos realistas para estabilidad)
  const maxVentas = Math.max(
    ...metricasIniciales.map((m) => m.ventasCount),
    250,
  );
  const maxProductos = Math.max(
    ...metricasIniciales.map((m) => m.productosCount),
    400,
  );
  const maxCierres = Math.max(
    ...metricasIniciales.map((m) => m.cierresCount),
    60,
  );
  const maxMonto = Math.max(
    ...metricasIniciales.map((m) => m.montoTotalVendido),
    10000000,
  );

  // 3. Calcular tarifa exacta entre $150.000 y $250.000 COP para cada empresa
  return metricasIniciales.map((m) => {
    let score = 0;

    // Si tiene uso mínimo (<= 15 ventas y <= 15 productos), se mantiene en la tarifa base mínima ($150.000)
    if (m.ventasCount <= 15 && m.productosCount <= 15) {
      score = 0;
    } else {
      const ratioVentas = Math.min(1, m.ventasCount / maxVentas);
      const ratioProductos = Math.min(1, m.productosCount / maxProductos);
      const ratioCierres = Math.min(1, m.cierresCount / maxCierres);
      // Raíz cuadrada en monto para suavizar picos de productos caros vs baratos
      const ratioMonto = Math.min(1, Math.sqrt(m.montoTotalVendido / maxMonto));

      // Ponderación: 40% Ventas, 25% Catálogo de Productos, 20% Turnos de Caja, 15% Volumen Facturado
      score =
        ratioVentas * 0.4 +
        ratioProductos * 0.25 +
        ratioCierres * 0.2 +
        ratioMonto * 0.15;
    }

    score = Math.max(0, Math.min(1, score));
    const indiceConsumoPct = Math.round(score * 100);

    // Redondear al múltiplo de $1.000 COP más cercano dentro de [$150.000, $250.000]
    const adicionalRedondeado =
      Math.round((RANGO_TARIFA_COP * score) / 1000) * 1000;
    const tarifaMensualCalculada = Math.min(
      MAX_TARIFA_COP,
      Math.max(MIN_TARIFA_COP, MIN_TARIFA_COP + adicionalRedondeado),
    );

    let nivelFlujo = "Básico / Inicial";
    if (indiceConsumoPct >= 75) {
      nivelFlujo = "Alto Volumen";
    } else if (indiceConsumoPct >= 40) {
      nivelFlujo = "Flujo Comercial Medio-Alto";
    } else if (indiceConsumoPct >= 15) {
      nivelFlujo = "Flujo Comercial Moderado";
    }

    const descuentoMesGratis = m.esMesGratis ? tarifaMensualCalculada : 0;
    const totalAPagar = m.esMesGratis ? 0 : tarifaMensualCalculada;

    return {
      ...m,
      indiceConsumoPct,
      nivelFlujo,
      tarifaMensualCalculada,
      descuentoMesGratis,
      totalAPagar,
    };
  });
}

export async function buildFacturaPdf(
  emp: EmpresaFacturacionData,
  fechaEmision: string,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoBytes = base64ToUint8Array(SOFTCREATE_LOGO_PNG_BASE64);
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN_X = 42;
  const CONTENT_W = PAGE_W - MARGIN_X * 2; // 511.28

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  // Paleta de colores ejecutiva
  const cDark = rgb(0.07, 0.09, 0.15); // #111827
  const cSlate700 = rgb(0.2, 0.25, 0.33); // #334155
  const cSlate500 = rgb(0.39, 0.45, 0.55); // #64748B
  const cSlate400 = rgb(0.58, 0.64, 0.72); // #94A3B8
  const cBorder = rgb(0.88, 0.91, 0.94); // #E2E8F0
  const cCardBg = rgb(0.97, 0.98, 0.99); // #F8FAFC
  const cWhite = rgb(1, 1, 1);

  const cBlue = rgb(0.15, 0.39, 0.92); // #2563EB
  const cBlueSoft = rgb(0.93, 0.96, 1.0); // #EFF6FF
  const cBlueBorder = rgb(0.75, 0.86, 0.99);

  const cGreen = rgb(0.08, 0.5, 0.24); // #15803D
  const cGreenSoft = rgb(0.94, 0.99, 0.96); // #F0FDF4
  const cGreenBorder = rgb(0.53, 0.94, 0.67);

  const drawRightText = (
    text: string,
    rightX: number,
    posY: number,
    size: number,
    font: any,
    color: any,
  ) => {
    const clean = sanitizePdfText(text);
    const w = font.widthOfTextAtSize(clean, size);
    page.drawText(clean, { x: rightX - w, y: posY, size, font, color });
  };

  // Barra superior
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 8,
    width: PAGE_W,
    height: 8,
    color: emp.esMesGratis ? cGreen : cDark,
  });

  // 1. CABECERA CON LOGO OFICIAL SOFTCREATE
  const logoW = 158;
  const logoH = 37.2;
  page.drawImage(logoImage, {
    x: MARGIN_X,
    y: PAGE_H - 60,
    width: logoW,
    height: logoH,
  });

  page.drawText("facturacion@softcreatepos.com  |  Pasto, Colombia", {
    x: MARGIN_X + 2,
    y: PAGE_H - 74,
    size: 8.2,
    font: fontNormal,
    color: cSlate500,
  });

  drawRightText(
    "FACTURA DE SUSCRIPCIÓN",
    PAGE_W - MARGIN_X,
    PAGE_H - 38,
    15.5,
    fontBold,
    cDark,
  );

  drawRightText(
    `Fecha de emisión: ${fechaEmision}`,
    PAGE_W - MARGIN_X,
    PAGE_H - 53,
    8.8,
    fontNormal,
    cSlate500,
  );

  // Etiqueta de Estado en Cabecera
  const badgeLabel = emp.esMesGratis
    ? "PRIMER MES GRATIS - NO REQUIERE PAGO"
    : "SUSCRIPCIÓN MENSUAL ACTIVA";
  const badgeBg = emp.esMesGratis ? cGreenSoft : cBlueSoft;
  const badgeBrd = emp.esMesGratis ? cGreenBorder : cBlueBorder;
  const badgeFg = emp.esMesGratis ? cGreen : cBlue;

  const pillW = fontBold.widthOfTextAtSize(badgeLabel, 7.8) + 18;
  const pillX = PAGE_W - MARGIN_X - pillW;
  const pillY = PAGE_H - 76;

  page.drawRectangle({
    x: pillX,
    y: pillY,
    width: pillW,
    height: 17,
    color: badgeBg,
    borderColor: badgeBrd,
    borderWidth: 1,
  });
  page.drawText(badgeLabel, {
    x: pillX + 9,
    y: pillY + 5,
    size: 7.8,
    font: fontBold,
    color: badgeFg,
  });

  page.drawLine({
    start: { x: MARGIN_X, y: PAGE_H - 88 },
    end: { x: PAGE_W - MARGIN_X, y: PAGE_H - 88 },
    thickness: 1,
    color: cBorder,
  });

  let y = PAGE_H - 108;

  // =========================================================================
  // 2. DATOS DEL CLIENTE Y DETALLES DE FACTURACIÓN
  // =========================================================================
  const infoH = 74;
  const infoBottom = y - infoH;

  page.drawRectangle({
    x: MARGIN_X,
    y: infoBottom,
    width: CONTENT_W,
    height: infoH,
    color: cCardBg,
    borderColor: cBorder,
    borderWidth: 1,
  });

  const col1X = MARGIN_X + 14;
  const col2X = MARGIN_X + CONTENT_W / 2 + 12;

  page.drawText("FACTURAR A:", {
    x: col1X,
    y: y - 18,
    size: 8,
    font: fontBold,
    color: cBlue,
  });
  page.drawText(sanitizePdfText(emp.nombre).slice(0, 38), {
    x: col1X,
    y: y - 34,
    size: 12,
    font: fontBold,
    color: cDark,
  });
  page.drawText(
    `NIT / ID Fiscal: ${sanitizePdfText(
      emp.id_fiscal && emp.id_fiscal !== "-"
        ? emp.id_fiscal
        : "Consumidor Final",
    )}`,
    {
      x: col1X,
      y: y - 50,
      size: 8.8,
      font: fontNormal,
      color: cSlate700,
    },
  );
  page.drawText(`Correo: ${sanitizePdfText(emp.correo)}`, {
    x: col1X,
    y: y - 64,
    size: 8.5,
    font: fontNormal,
    color: cSlate500,
  });

  page.drawText("DETALLES DEL CICLO:", {
    x: col2X,
    y: y - 18,
    size: 8,
    font: fontBold,
    color: cBlue,
  });

  const drawDetailRow = (rowY: number, label: string, val: string, color = cDark) => {
    page.drawText(sanitizePdfText(label), {
      x: col2X,
      y: rowY,
      size: 8.8,
      font: fontNormal,
      color: cSlate500,
    });
    page.drawText(sanitizePdfText(val), {
      x: col2X + 108,
      y: rowY,
      size: 8.8,
      font: fontBold,
      color,
    });
  };

  drawDetailRow(
    y - 34,
    "Fecha de afiliación:",
    `${emp.fechaCreacionStr} (${emp.diasAntiguedad} días)`,
  );
  drawDetailRow(
    y - 49,
    "Clasificación de uso:",
    emp.nivelFlujo,
  );
  drawDetailRow(
    y - 64,
    "Fecha límite de pago:",
    emp.esMesGratis ? "Sin cobro (Mes Gratis)" : "Día 1 del mes",
    emp.esMesGratis ? cGreen : cDark,
  );

  y = infoBottom - 24;

  // =========================================================================
  // 3. MÉTRICAS REALES DE USO Y FLUJO DE LA EMPRESA (TRANSPARENCIA DE COBRO)
  // =========================================================================
  page.drawText("RESUMEN DE ACTIVIDAD Y FLUJO EN BASE DE DATOS", {
    x: MARGIN_X,
    y,
    size: 10,
    font: fontBold,
    color: cDark,
  });
  y -= 10;

  const kpiGap = 11.64;
  const kpiW = (CONTENT_W - kpiGap * 2) / 3;
  const kpiH = 56;
  const kpiBottom = y - kpiH;

  const drawMetricCard = (
    xPos: number,
    title: string,
    bigValue: string,
    sub: string,
  ) => {
    page.drawRectangle({
      x: xPos,
      y: kpiBottom,
      width: kpiW,
      height: kpiH,
      color: cWhite,
      borderColor: cBorder,
      borderWidth: 1,
    });
    page.drawText(sanitizePdfText(title), {
      x: xPos + 12,
      y: kpiBottom + 40,
      size: 7.5,
      font: fontBold,
      color: cSlate500,
    });
    page.drawText(sanitizePdfText(bigValue), {
      x: xPos + 12,
      y: kpiBottom + 21,
      size: 13.5,
      font: fontBold,
      color: cDark,
    });
    page.drawText(sanitizePdfText(sub), {
      x: xPos + 12,
      y: kpiBottom + 8,
      size: 7.5,
      font: fontNormal,
      color: cSlate500,
    });
  };

  drawMetricCard(
    MARGIN_X,
    "TRANSACCIONES DE VENTA",
    `${emp.ventasCount} ventas`,
    "Procesadas en el sistema",
  );
  drawMetricCard(
    MARGIN_X + kpiW + kpiGap,
    "PRODUCTOS REGISTRADOS",
    `${emp.productosCount} productos`,
    "Almacenados en catálogo",
  );
  drawMetricCard(
    MARGIN_X + (kpiW + kpiGap) * 2,
    "OPERACIÓN DE CAJAS",
    `${emp.cierresCount} turnos`,
    `${emp.cajasCount} caja(s) en ${emp.sucursalesCount} sucursal(es)`,
  );

  y = kpiBottom - 24;

  // =========================================================================
  // 4. TABLA DE LIQUIDACIÓN Y TOTAL A PAGAR
  // =========================================================================
  page.drawText("DETALLE DE FACTURACIÓN DEL SERVICIO", {
    x: MARGIN_X,
    y,
    size: 10,
    font: fontBold,
    color: cDark,
  });
  y -= 10;

  const thH = 24;
  const thBottom = y - thH;
  page.drawRectangle({
    x: MARGIN_X,
    y: thBottom,
    width: CONTENT_W,
    height: thH,
    color: cDark,
  });
  page.drawText("CONCEPTO / DESCRIPCIÓN", {
    x: MARGIN_X + 12,
    y: thBottom + 8,
    size: 8.2,
    font: fontBold,
    color: cWhite,
  });
  page.drawText("PERIODO", {
    x: MARGIN_X + 320,
    y: thBottom + 8,
    size: 8.2,
    font: fontBold,
    color: cWhite,
  });
  drawRightText(
    "VALOR",
    MARGIN_X + CONTENT_W - 12,
    thBottom + 8,
    8.2,
    fontBold,
    cWhite,
  );

  y = thBottom;

  // Fila 1: Mensualidad calculada por el algoritmo ($150.000 - $250.000)
  const r1H = 38;
  const r1Bottom = y - r1H;
  page.drawRectangle({
    x: MARGIN_X,
    y: r1Bottom,
    width: CONTENT_W,
    height: r1H,
    color: cWhite,
    borderColor: cBorder,
    borderWidth: 0.8,
  });
  page.drawText("Suscripción Mensual Sistema de Ventas SoftCreate POS", {
    x: MARGIN_X + 12,
    y: r1Bottom + 22,
    size: 9.2,
    font: fontBold,
    color: cDark,
  });
  page.drawText(
    `Tarifa ajustada según flujo de transacciones y uso (${emp.nivelFlujo})`,
    {
      x: MARGIN_X + 12,
      y: r1Bottom + 9,
      size: 8,
      font: fontNormal,
      color: cSlate500,
    },
  );
  page.drawText("1 Mes", {
    x: MARGIN_X + 320,
    y: r1Bottom + 16,
    size: 9,
    font: fontNormal,
    color: cSlate700,
  });
  drawRightText(
    `${formatCOP(emp.tarifaMensualCalculada)} COP`,
    MARGIN_X + CONTENT_W - 12,
    r1Bottom + 16,
    9.5,
    fontBold,
    cDark,
  );

  y = r1Bottom;

  // Fila 2 (Solo si aplica Primer Mes Gratis): Descuento del 100%
  if (emp.esMesGratis) {
    const r2H = 34;
    const r2Bottom = y - r2H;
    page.drawRectangle({
      x: MARGIN_X,
      y: r2Bottom,
      width: CONTENT_W,
      height: r2H,
      color: cGreenSoft,
      borderColor: cGreenBorder,
      borderWidth: 0.8,
    });
    page.drawText(
      "Beneficio Primer Mes Gratis de Bienvenida (100% de descuento)",
      {
        x: MARGIN_X + 12,
        y: r2Bottom + 19,
        size: 9,
        font: fontBold,
        color: cGreen,
      },
    );
    page.drawText(
      "Exoneración total por encontrarse en su primer mes desde la creación de la empresa",
      {
        x: MARGIN_X + 12,
        y: r2Bottom + 7.5,
        size: 7.8,
        font: fontNormal,
        color: cGreen,
      },
    );
    page.drawText("Cortesía", {
      x: MARGIN_X + 320,
      y: r2Bottom + 13,
      size: 8.8,
      font: fontBold,
      color: cGreen,
    });
    drawRightText(
      `- ${formatCOP(emp.descuentoMesGratis)} COP`,
      MARGIN_X + CONTENT_W - 12,
      r2Bottom + 13,
      9.5,
      fontBold,
      cGreen,
    );
    y = r2Bottom;
  }

  // Caja de Total a Pagar
  const totH = 38;
  const totBottom = y - totH;
  page.drawRectangle({
    x: MARGIN_X,
    y: totBottom,
    width: CONTENT_W,
    height: totH,
    color: emp.esMesGratis ? cGreenSoft : cBlueSoft,
    borderColor: emp.esMesGratis ? cGreenBorder : cBlueBorder,
    borderWidth: 1.2,
  });
  page.drawText(
    emp.esMesGratis
      ? "TOTAL A PAGAR ESTE MES (PRIMER MES GRATIS):"
      : "TOTAL A PAGAR:",
    {
      x: MARGIN_X + 14,
      y: totBottom + 13.5,
      size: 10.5,
      font: fontBold,
      color: emp.esMesGratis ? cGreen : cDark,
    },
  );
  drawRightText(
    `${formatCOP(emp.totalAPagar)} COP`,
    MARGIN_X + CONTENT_W - 14,
    totBottom + 12.5,
    14,
    fontBold,
    emp.esMesGratis ? cGreen : cBlue,
  );

  y = totBottom - 26;

  // =========================================================================
  // 5. BLOQUE INFORMATIVO (MES GRATIS vs INSTRUCCIONES DE PAGO)
  // =========================================================================
  if (emp.esMesGratis) {
    const boxH = 82;
    const boxBottom = y - boxH;
    page.drawRectangle({
      x: MARGIN_X,
      y: boxBottom,
      width: CONTENT_W,
      height: boxH,
      color: cGreenSoft,
      borderColor: cGreenBorder,
      borderWidth: 1,
    });
    page.drawText("¡DISFRUTA TU PRIMER MES GRATIS EN SOFTCREATE POS!", {
      x: MARGIN_X + 16,
      y: boxBottom + 58,
      size: 10,
      font: fontBold,
      color: cGreen,
    });
    page.drawText(
      "- Esta factura es únicamente informativa: NO debes realizar ningún pago en este corte.",
      {
        x: MARGIN_X + 16,
        y: boxBottom + 40,
        size: 8.8,
        font: fontNormal,
        color: cDark,
      },
    );
    page.drawText(
      `- Tu empresa fue creada el ${emp.fechaCreacionStr}, por lo que cuentas con 30 días iniciales sin costo.`,
      {
        x: MARGIN_X + 16,
        y: boxBottom + 25,
        size: 8.8,
        font: fontNormal,
        color: cDark,
      },
    );
    page.drawText(
      "- A partir de tu segundo mes se realizará el cobro normal de acuerdo con el flujo de uso de tu negocio.",
      {
        x: MARGIN_X + 16,
        y: boxBottom + 10,
        size: 8.8,
        font: fontNormal,
        color: cDark,
      },
    );
  } else {
    const boxH = 84;
    const boxBottom = y - boxH;
    page.drawRectangle({
      x: MARGIN_X,
      y: boxBottom,
      width: CONTENT_W,
      height: boxH,
      color: cCardBg,
      borderColor: cBorder,
      borderWidth: 1,
    });
    page.drawText("MEDIOS E INSTRUCCIONES DE PAGO", {
      x: MARGIN_X + 16,
      y: boxBottom + 60,
      size: 10,
      font: fontBold,
      color: cDark,
    });
    page.drawText("- Nequi: 3116025328", {
      x: MARGIN_X + 16,
      y: boxBottom + 42,
      size: 9.2,
      font: fontBold,
      color: cSlate700,
    });
    page.drawText("- Efectivo: Pago presencial (entrega personal)", {
      x: MARGIN_X + 16,
      y: boxBottom + 26,
      size: 9.2,
      font: fontNormal,
      color: cSlate700,
    });
    page.drawText(
      "Una vez realizado el pago, por favor envía el comprobante para registrar tu abono inmediatamente.",
      {
        x: MARGIN_X + 16,
        y: boxBottom + 10,
        size: 8.2,
        font: fontNormal,
        color: cSlate500,
      },
    );
  }

  // Pie de página
  page.drawLine({
    start: { x: MARGIN_X, y: 48 },
    end: { x: PAGE_W - MARGIN_X, y: 48 },
    thickness: 0.8,
    color: cBorder,
  });
  page.drawText(
    "¡Gracias por confiar en SoftCreate POS para impulsar y administrar tu negocio!",
    {
      x: MARGIN_X,
      y: 32,
      size: 8.5,
      font: fontBold,
      color: cSlate500,
    },
  );
  drawRightText(
    "SoftCreate POS - Pasto, Colombia",
    PAGE_W - MARGIN_X,
    32,
    8.2,
    fontNormal,
    cSlate400,
  );

  return await pdfDoc.save();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let reqBody: any = {};
    try {
      if (req.method === "POST") {
        reqBody = await req.json();
      }
    } catch (_e) {
      reqBody = {};
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
    const whatsappServiceUrl = (
      reqBody?.whatsapp_service_url ||
      Deno.env.get("WHATSAPP_SERVICE_URL") ||
      ""
    )
      .trim()
      .replace(/\/+$/, "");
    const whatsappApiKey =
      reqBody?.whatsapp_api_key ||
      Deno.env.get("WHATSAPP_API_KEY") ||
      "softcreate-pos-secret-2026";
    const incluirWhatsappPayload = Boolean(reqBody?.incluir_whatsapp_payload);
    const omitirCorreo = Boolean(reqBody?.omitir_correo);

    // 1. Obtener empresas con correo y métricas globales de la base de datos
    const [resEmpresas, resVentas, resProductos, resSucursales] =
      await Promise.all([
        supabase
          .from("empresa")
          .select("id, nombre, correo, id_fiscal, telefono_celular")
          .not("correo", "is", null),
        supabase
          .from("ventas")
          .select("id, id_empresa, monto_total, fecha, estado"),
        supabase.from("productos").select("id, id_empresa"),
        supabase
          .from("sucursales")
          .select(
            "id, id_empresa, caja(id, fecha_creacion, cierrecaja(id, fechainicio)), asignacion_sucursal(id_usuario, usuarios(id, telefono))",
          ),
      ]);

    if (resEmpresas.error) throw resEmpresas.error;
    const empresasRaw = (resEmpresas.data || []).filter(
      (e: any) => e?.correo && String(e.correo).trim().includes("@"),
    );

    if (empresasRaw.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No hay empresas con correo válido para enviar facturas.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // 2. Subir logo oficial de SoftCreate al bucket público 'imagenes' para que se vea siempre en los correos
    let logoPublicUrl = "";
    try {
      const logoBytes = base64ToUint8Array(SOFTCREATE_LOGO_PNG_BASE64);
      const storagePath = "branding/softcreate-logo.png";
      await supabase.storage.from("imagenes").upload(storagePath, logoBytes, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });
      const { data: pubData } = supabase.storage
        .from("imagenes")
        .getPublicUrl(storagePath);
      if (pubData?.publicUrl) {
        logoPublicUrl = pubData.publicUrl;
      }
    } catch (_e) {
      // Fallback silencioso
    }

    const hoy = new Date();
    const fechaEmision = formatDateOnly(hoy.toISOString());
    const { fechaBogotaStr, diaMes } = obtenerDiaColombia(hoy);
    const forzarCorreo = Boolean(reqBody?.forzar_correo);

    let correoYaEnviadoHoy = false;
    try {
      const { data: ctrlBlob } = await supabase.storage
        .from("imagenes")
        .download("branding/control-envios-facturas.json");
      if (ctrlBlob) {
        const ctrlJson = JSON.parse(await ctrlBlob.text());
        if (ctrlJson?.ultimaFechaCorreo === fechaBogotaStr) {
          correoYaEnviadoHoy = true;
        }
      }
    } catch (_e) {}

    // 3. Calcular facturación precisa ($150.000 a $250.000 COP) + verificación de primer mes gratis
    const empresasFacturacion = calcularFacturacionEmpresas(
      empresasRaw,
      resVentas.data || [],
      resProductos.data || [],
      resSucursales.data || [],
      hoy,
    );

    const resumenEnvios: any[] = [];
    let algunCorreoEnviadoHoy = false;

    for (const emp of empresasFacturacion) {
      const pdfBytes = await buildFacturaPdf(emp, fechaEmision);
      const base64Pdf = uint8ArrayToBase64(pdfBytes);

      const badgeBgHtml = emp.esMesGratis ? "#dcfce7" : "#dbeafe";
      const badgeColorHtml = emp.esMesGratis ? "#15803d" : "#1d4ed8";
      const badgeTextHtml = emp.esMesGratis
        ? "PRIMER MES GRATIS DE BIENVENIDA — TOTAL A PAGAR: $ 0 COP"
        : `SUSCRIPCIÓN MENSUAL — TOTAL A PAGAR: ${formatCOP(emp.totalAPagar)} COP`;

      const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <div style="height: 6px; background-color: ${emp.esMesGratis ? "#15803d" : "#0f172a"};"></div>

          <!-- Cabecera con Logo Oficial SoftCreate -->
          <div style="padding: 28px 30px 20px; border-bottom: 1px solid #e2e8f0; text-align: center; background-color: #ffffff;">
            ${
              logoPublicUrl
                ? `<img src="${logoPublicUrl}" width="185" alt="SoftCreate" style="display: block; margin: 0 auto 12px; max-width: 185px; height: auto;" />`
                : `<div style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">SoftCreate</div>`
            }
            <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px;">
              Factura de Suscripción Mensual
            </div>
            <span style="display: inline-block; background-color: ${badgeBgHtml}; color: ${badgeColorHtml}; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 999px;">
              ${badgeTextHtml}
            </span>
          </div>

          <!-- Cuerpo -->
          <div style="padding: 28px 30px;">
            <p style="color: #1e293b; font-size: 15.5px; margin-top: 0; line-height: 1.5;">
              Hola, <strong>${emp.nombre}</strong>,
            </p>
            ${
              emp.esMesGratis
                ? `<p style="color: #334155; font-size: 14.5px; line-height: 1.6;">
                    ¡Gracias por unirte a <strong>SoftCreate POS</strong>! Te enviamos el resumen de tu suscripción mensual. Como tu empresa fue registrada recientemente (<strong>${emp.fechaCreacionStr}</strong>), <strong>este primer mes es totalmente GRATIS</strong> y no debes realizar ningún pago.
                  </p>`
                : `<p style="color: #334155; font-size: 14.5px; line-height: 1.6;">
                    Esperamos que estés teniendo un excelente mes de ventas. Adjunto a este correo encontrarás la factura en formato PDF correspondiente a la mensualidad de tu sistema <strong>SoftCreate POS</strong>, calculada de acuerdo con el flujo y actividad de tu negocio.
                  </p>`
            }

            <!-- Resumen de Liquidación -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin: 22px 0;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 12px;">
                Resumen de tu Factura
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #475569; font-size: 14px;">Valor mensualidad (${emp.nivelFlujo}):</td>
                  <td style="padding: 6px 0; text-align: right; color: #0f172a; font-size: 14.5px; font-weight: 600;">${formatCOP(emp.tarifaMensualCalculada)} COP</td>
                </tr>
                ${
                  emp.esMesGratis
                    ? `<tr>
                        <td style="padding: 6px 0; color: #15803d; font-size: 14px; font-weight: 600;">Beneficio Primer Mes Gratis (-100%):</td>
                        <td style="padding: 6px 0; text-align: right; color: #15803d; font-size: 14.5px; font-weight: 700;">- ${formatCOP(emp.descuentoMesGratis)} COP</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 10px 0 4px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 15px; font-weight: 700;">Total a pagar:</td>
                  <td style="padding: 10px 0 4px; border-top: 1px solid #e2e8f0; text-align: right; color: ${emp.esMesGratis ? "#15803d" : "#2563eb"}; font-size: 18px; font-weight: 800;">
                    ${formatCOP(emp.totalAPagar)} COP
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 6px; color: #64748b; font-size: 13px;">Fecha límite de pago:</td>
                  <td style="padding-top: 6px; text-align: right; color: ${emp.esMesGratis ? "#15803d" : "#dc2626"}; font-size: 13px; font-weight: 700;">
                    ${emp.esMesGratis ? "No aplica (Mes Gratis)" : "Día 1 del mes"}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Actividad Medida -->
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">
                Actividad registrada en tu cuenta
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #475569;">
                <tr>
                  <td style="padding: 4px 0;">Ventas procesadas:</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0f172a;">${emp.ventasCount} ventas</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">Productos en catálogo:</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0f172a;">${emp.productosCount} productos</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">Turnos de caja operados:</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0f172a;">${emp.cierresCount} turnos</td>
                </tr>
              </table>
            </div>

            ${
              emp.esMesGratis
                ? `<div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 4px; color: #166534; font-size: 13.5px; line-height: 1.5;">
                    <strong>Nota importante:</strong> No tienes que realizar ningún pago este mes. Disfruta todas las funciones de <strong>SoftCreate POS</strong>; tu facturación normal comenzará a partir del segundo mes.
                  </div>`
                : `<h3 style="color: #0f172a; font-size: 15px; margin-bottom: 10px;">Medios de pago autorizados:</h3>
                  <ul style="color: #334155; font-size: 14px; line-height: 1.6; padding-left: 20px; margin-bottom: 20px;">
                    <li style="margin-bottom: 6px;"><strong>Nequi:</strong> 3116025328</li>
                    <li><strong>Efectivo:</strong> Pago presencial (entrega personal)</li>
                  </ul>`
            }

            <p style="color: #64748b; font-size: 13.5px; line-height: 1.5; margin-top: 20px; margin-bottom: 0;">
              Para cualquier consulta o soporte técnico, puedes responder directamente a este correo.
            </p>
          </div>

          <!-- Pie de página -->
          <div style="background-color: #f8fafc; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12.5px; margin: 0; line-height: 1.5;">
              <strong>SoftCreate POS</strong> — Tecnología para hacer crecer tu negocio.<br>
              Pasto, Colombia.
            </p>
          </div>
        </div>
      </body>
      </html>
      `;

      const safeNombre = sanitizePdfText(emp.nombre)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_");
      const nombreArchivoPdf = `Factura_SoftCreate_${safeNombre}.pdf`;

      const subject = emp.esMesGratis
        ? `Tu factura mensual de SoftCreate POS — ¡Primer Mes Gratis! ($ 0 COP) | ${emp.nombre}`
        : `Tu factura mensual de SoftCreate POS (${formatCOP(emp.totalAPagar)} COP) | ${emp.nombre}`;

      let correoEnviado = false;
      const debeEnviarCorreo =
        !omitirCorreo && Boolean(resendKey) && (!correoYaEnviadoHoy || forzarCorreo);

      if (debeEnviarCorreo) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Facturación SoftCreate <facturacion@softcreatepos.com>",
            to: emp.correo,
            subject,
            html: htmlBody,
            attachments: [
              {
                filename: nombreArchivoPdf,
                content: base64Pdf,
              },
            ],
          }),
        });

        if (res.ok) {
          correoEnviado = true;
          algunCorreoEnviadoHoy = true;
        } else {
          console.error(
            `Error enviando factura a ${emp.correo}:`,
            await res.text(),
          );
        }
      } else if (correoYaEnviadoHoy && !omitirCorreo) {
        correoEnviado = true;
      }

      const mensajeWhatsapp = construirMensajeWhatsapp(emp, diaMes);
      let whatsappEnviado = false;
      let whatsappDetalle = emp.telefono
        ? "Listo para enviar"
        : "Sin teléfono registrado";

      if (whatsappServiceUrl && emp.telefono) {
        try {
          const waRes = await fetch(`${whatsappServiceUrl}/enviar-factura`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": whatsappApiKey,
            },
            body: JSON.stringify({
              telefono: emp.telefono,
              empresa: emp.nombre,
              mensaje: mensajeWhatsapp,
              nombreArchivo: nombreArchivoPdf,
              pdfBase64: base64Pdf,
            }),
          });
          if (waRes.ok) {
            whatsappEnviado = true;
            whatsappDetalle = `Enviado a +${emp.telefono}`;
          } else {
            whatsappDetalle = `Error gateway: ${await waRes.text()}`;
          }
        } catch (waErr: any) {
          whatsappDetalle = `Error conexión WhatsApp: ${waErr?.message || "No disponible"}`;
        }
      }

      const itemResumen: any = {
        id: emp.id,
        empresa: emp.nombre,
        correo: emp.correo,
        telefono: emp.telefono,
        diasAntiguedad: emp.diasAntiguedad,
        esMesGratis: emp.esMesGratis,
        tarifaCalculada: emp.tarifaMensualCalculada,
        totalAPagar: emp.totalAPagar,
        correoEnviado,
        whatsappEnviado,
        whatsappDetalle,
      };

      if (incluirWhatsappPayload) {
        itemResumen.nombreArchivo = nombreArchivoPdf;
        itemResumen.mensajeWhatsapp = mensajeWhatsapp;
        itemResumen.pdfBase64 = base64Pdf;
      }

      resumenEnvios.push(itemResumen);
    }

    if (algunCorreoEnviadoHoy) {
      try {
        const ctrlBytes = new TextEncoder().encode(
          JSON.stringify({
            ultimaFechaCorreo: fechaBogotaStr,
            actualizadoEn: new Date().toISOString(),
          }),
        );
        await supabase.storage
          .from("imagenes")
          .upload("branding/control-envios-facturas.json", ctrlBytes, {
            contentType: "application/json",
            cacheControl: "0",
            upsert: true,
          });
      } catch (_e) {}
    }

    return new Response(
      JSON.stringify({
        message:
          "Facturación procesada y enviada con éxito a todas las empresas.",
        facturas: resumenEnvios,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Error interno" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
