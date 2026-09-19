import { urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
import { FormatearNumeroDinero } from "../utils/Conversiones";

const ANCHO_PAGINA = 204.09;
const MARGEN = 4;
const ANCHO_UTIL = ANCHO_PAGINA - MARGEN * 2;

const lineaPunteada = (margin = [0, 6, 0, 6]) => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: ANCHO_UTIL,
      y2: 0,
      lineWidth: 0.75,
      lineColor: "#999999",
      dash: {
        length: 2,
        space: 2,
      },
    },
  ],
  margin,
});

const TicketEntradasSalidas = async (output, data) => {
  const esEntrada = `${data.tipo}`.toLowerCase() === "entrada";

  const colorAccento = esEntrada ? "#2e7d32" : "#c62828";
  const colorFondoBadge = esEntrada ? "#e8f5e9" : "#fdecea";
  const colorBorde = esEntrada ? "#a5d6a7" : "#ef9a9a";

  const titulo = esEntrada ? "ENTRADA" : "SALIDA";

  const logoempresa = await urlToBase64(
    !data.logo || data.logo === "-"
      ? "https://i.ibb.co/HLNmDKRK/administracion-de-empresas.gif"
      : data.logo,
  );

  const content = [
    {
      table: {
        widths: [ANCHO_UTIL],
        body: [
          [
            {
              image: logoempresa,
              fit: [65, 65],
              alignment: "center",
              margin: [0, 4, 0, 4],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#333333",
        vLineColor: () => "#333333",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 7],
    },
    {
      text: `${data.direccion_empresa}`,
      style: "empresaDato",
    },
    {
      text: `${data.pais}`,
      style: "empresaDato",
      margin: [0, 0, 0, 6],
    },
    lineaPunteada([0, 0, 0, 8]),
    {
      table: {
        widths: [ANCHO_UTIL],
        body: [
          [
            {
              stack: [
                {
                  text: titulo,
                  fontSize: 22,
                  bold: true,
                  alignment: "center",
                  color: colorAccento,
                  characterSpacing: 2,
                },
                {
                  text: "MOVIMIENTO DE CAJA",
                  fontSize: 7,
                  alignment: "center",
                  color: "#888888",
                  characterSpacing: 1,
                  margin: [0, 2, 0, 0],
                },
              ],
              alignment: "center",
              fillColor: colorFondoBadge,
              margin: [0, 8, 0, 8],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1.2,
        vLineWidth: () => 1.2,
        hLineColor: () => colorBorde,
        vLineColor: () => colorBorde,
        paddingLeft: () => 0,
        paddingRight: () => 0,
      },
      margin: [0, 0, 0, 8],
    },
    {
      table: {
        widths: [45, "*"],
        body: [
          [
            { text: "FECHA", style: "tInfoLabel" },
            {
              text: `${data.fecha || "-"}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: true,
            },
          ],
          [
            { text: "MÉTODO", style: "tInfoLabel" },
            {
              text: `${data.metodo_pago || "Efectivo"}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: true,
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingTop: () => 2,
        paddingBottom: () => 2,
        paddingLeft: () => 0,
        paddingRight: () => 0,
      },
    },
    lineaPunteada(),
    {
      text: "MONTO",
      style: "seccionTitulo",
      alignment: "center",
      margin: [0, 0, 0, 2],
    },
    {
      text: `${FormatearNumeroDinero(data.monto, "COP", "CO")}`,
      alignment: "center",
      bold: true,
      fontSize: 20,
      color: colorAccento,
      margin: [0, 0, 0, 8],
    },
    lineaPunteada(),
    {
      text: "MOTIVO",
      style: "seccionTitulo",
      margin: [0, 0, 0, 4],
    },
    {
      table: {
        widths: [ANCHO_UTIL],
        body: [
          [
            {
              text: `${data.motivo || "-"}`,
              style: "tInfoValue",
              alignment: "left",
              margin: [4, 4, 4, 4],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.75,
        vLineWidth: () => 0.75,
        hLineColor: () => "#dcdcdc",
        vLineColor: () => "#dcdcdc",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    },
    lineaPunteada([0, 10, 0, 0]),
    {
      text: "COMPROBANTE INTERNO - MOVIMIENTO DE CAJA",
      fontSize: 6.5,
      bold: true,
      alignment: "center",
      color: "#999999",
      characterSpacing: 0.5,
    },
  ];

  const styles = {
    empresaDato: {
      fontSize: 8,
      alignment: "center",
      color: "#555555",
    },
    seccionTitulo: {
      fontSize: 7.5,
      bold: true,
      color: "#777777",
      characterSpacing: 0.5,
    },
    tInfoLabel: {
      fontSize: 8,
      bold: true,
      color: "#555555",
    },
    tInfoValue: {
      fontSize: 8,
      bold: true,
    },
  };

  const response = await createPdf(
    {
      pageSize: {
        width: ANCHO_PAGINA,
        height: "auto",
      },
      pageMargins: [MARGEN, MARGEN, MARGEN, MARGEN],
      content,
      styles,
    },
    output,
  );

  return response;
};

export default TicketEntradasSalidas;
