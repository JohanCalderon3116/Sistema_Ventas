import qz from "qz-tray";
import { configurarFirmaQZ } from "../../utils/qzSecurity";

const PULSOS = "1B700019FA" + "1B700119FA"; // pin 2 + pin 5
const REGEX_TERMICA = /pos|thermal|termic|receipt|80/i;
const EXCLUIDAS = /pdf|onenote|xps|fax/i;

let firmaConfigurada = false;
const CLAVE_CACHE = "impresora_caja_ok";

async function candidatas() {
  const lista = await qz.printers.find();
  console.log("Impresoras que ve QZ:", lista);

  const termicas = lista.filter(
    (n) => REGEX_TERMICA.test(n) && !EXCLUIDAS.test(n)
  );

  // La última que funcionó va primero
  const ultima = localStorage.getItem(CLAVE_CACHE);
  if (ultima && termicas.includes(ultima)) {
    termicas.splice(termicas.indexOf(ultima), 1);
    termicas.unshift(ultima);
  }

  const def = await qz.printers.getDefault().catch(() => null);
  if (def && !termicas.includes(def) && !EXCLUIDAS.test(def)) {
    termicas.push(def);
  }

  if (!termicas.length) {
    throw new Error("QZ no ve ninguna impresora: " + JSON.stringify(lista));
  }
  return termicas;
}

export async function abrirCaja() {
  if (!firmaConfigurada) {
    configurarFirmaQZ();
    firmaConfigurada = true;
  }
  if (!qz.websocket.isActive()) await qz.websocket.connect();

  const lista = await candidatas();
  let ultimoError;

  for (const impresora of lista) {
    try {
      await qz.print(qz.configs.create(impresora), [
        { type: "raw", format: "command", flavor: "hex", data: PULSOS },
      ]);
      console.log("Caja abierta con", impresora);
      localStorage.setItem(CLAVE_CACHE, impresora);
      return impresora;
    } catch (e) {
      console.warn(`"${impresora}" no aceptó el trabajo, probando otra...`, e);
      ultimoError = e;
    }
  }

  localStorage.removeItem(CLAVE_CACHE);
  console.error("Error abrirCaja: ninguna impresora respondió", ultimoError);
  throw ultimoError;
}