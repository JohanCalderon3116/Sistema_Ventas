// AbrirCajaImpresora.jsx (o utils/abrirCaja.js)
import qz from "qz-tray";
import { configurarFirmaQZ } from "../../utils/qzSecurity";

const PULSOS = "1B700019FA" + "1B700119FA"; // pin 2 + pin 5

let firmaConfigurada = false;

async function obtenerImpresora() {
  const lista = await qz.printers.find();
  console.log("Impresoras que ve QZ:", lista);

  const termica = lista.find((n) => /pos|thermal|termic|80/i.test(n));
  if (termica) return termica;

  const def = await qz.printers.getDefault().catch(() => null);
  if (def) return def;

  throw new Error("QZ no ve ninguna impresora: " + JSON.stringify(lista));
}

export async function abrirCaja() {
  try {
    if (!firmaConfigurada) {
      configurarFirmaQZ();
      firmaConfigurada = true;
    }
    if (!qz.websocket.isActive()) await qz.websocket.connect();
    console.log("QZ conectado");

    const impresora = await obtenerImpresora();
    console.log("Impresora usada:", impresora);

    await qz.print(qz.configs.create(impresora), [
      { type: "raw", format: "command", flavor: "hex", data: PULSOS },
    ]);
    console.log("Comando enviado a", impresora);
  } catch (e) {
    console.error("Error abrirCaja:", e);
    throw e;
  }
}
