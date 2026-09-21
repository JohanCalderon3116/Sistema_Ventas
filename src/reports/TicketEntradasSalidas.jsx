import { urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
import { FormatearNumeroDinero } from "../utils/Conversiones";

const ANCHO_PAGINA = 204.09;
const MARGEN = 4;
const ANCHO_UTIL = ANCHO_PAGINA - MARGEN * 2;

const NEGRO = "#000000";

const linea = (margin = [0, 3, 0, 3]) => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: ANCHO_UTIL,
      y2: 0,
      lineWidth: 1,
      lineColor: NEGRO,
      dash: { length: 2, space: 2 },
    },
  ],
  margin,
});

const fila = (label, value) => ({
  columns: [
    { text: label, style: "label", width: 50 },
    { text: value, style: "valor", alignment: "right", width: "*" },
  ],
  margin: [0, 1, 0, 1],
});

const TicketEntradasSalidas = async (output, data) => {
  const esEntrada = `${data.tipo}`.toLowerCase() === "entrada";
  const titulo = esEntrada ? "ENTRADA" : "SALIDA";

  const logoempresa = await urlToBase64(
    !data.logo || data.logo === "-"
      ? "https://i.ibb.co/HLNmDKRK/administracion-de-empresas.gif"
      : data.logo,
  );

  const content = [
    {
      image: logoempresa,
      fit: [45, 45],
      alignment: "center",
      margin: [0, 0, 0, 3],
    },
    { text: `${data.direccion_empresa}`, style: "empresaDato" },
    { text: `${data.pais}`, style: "empresaDato" },
    linea(),
    {
      text: titulo,
      fontSize: 14,
      bold: true,
      color: NEGRO,
      alignment: "center",
      characterSpacing: 1.5,
    },
    {
      text: "MOVIMIENTO DE CAJA",
      fontSize: 6.5,
      bold: true,
      alignment: "center",
      color: NEGRO,
      margin: [0, 0, 0, 3],
    },
    fila("FECHA", `${data.fecha || "-"}`),
    fila("MÉTODO", `${data.metodo_pago || "Efectivo"}`),
    linea(),
    {
      text: "MONTO",
      style: "label",
      alignment: "center",
    },
    {
      text: FormatearNumeroDinero(data.monto, "COP", "CO"),
      alignment: "center",
      bold: true,
      color: NEGRO,
      fontSize: 16,
      margin: [0, 0, 0, 2],
    },
    linea(),
    { text: "MOTIVO", style: "label", margin: [0, 0, 0, 2] },
    { text: `${data.motivo || "-"}`, style: "valor" },
    linea([0, 6, 0, 2]),
    {
      text: "COMPROBANTE INTERNO - MOVIMIENTO DE CAJA",
      fontSize: 6,
      bold: true,
      alignment: "center",
      color: NEGRO,
    },
  ];

  const styles = {
    empresaDato: {
      fontSize: 7.5,
      bold: true,
      alignment: "center",
      color: NEGRO,
    },
    label: { fontSize: 7.5, bold: true, color: NEGRO },
    valor: { fontSize: 8, bold: true, color: NEGRO },
  };

  const response = await createPdf(
    {
      pageSize: { width: ANCHO_PAGINA, height: "auto" },
      pageMargins: [MARGEN, MARGEN, MARGEN, MARGEN],
      defaultStyle: { color: NEGRO, bold: true },
      content,
      styles,
    },
    output,
  );

  return response;
};

export default TicketEntradasSalidas;
