// utils/abrirCaja.js
import qz from "qz-tray";

const PULSOS = "1B700019FA" + "1B700119FA"; // pin 2 + pin 5

export async function abrirCaja() {
  if (!qz.websocket.isActive()) await qz.websocket.connect();
  const impresora = await qz.printers.getDefault();
  await qz.print(qz.configs.create(impresora), [
    { type: "raw", format: "command", flavor: "hex", data: PULSOS },
  ]);
}