// utils/abrirCaja.js
import qz from "qz-tray";
import { configurarFirmaQZ } from "../../utils/qzSecurity";

const PULSOS = "1B700019FA" + "1B700119FA"; // pin 2 + pin 5

let firmaConfigurada = false;

export async function abrirCaja() {
  try {
    if (!firmaConfigurada) {
      configurarFirmaQZ();
      firmaConfigurada = true;
    }
    if (!qz.websocket.isActive()) await qz.websocket.connect();
    console.log("QZ conectado");
    const impresora = await qz.printers.getDefault();
    console.log("Impresora por defecto:", impresora);
    await qz.print(qz.configs.create(impresora), [
      { type: "raw", format: "command", flavor: "hex", data: PULSOS },
    ]);
  } catch (e) {
    console.error("Error abrirCaja:", e);
    throw e;
  }
}
