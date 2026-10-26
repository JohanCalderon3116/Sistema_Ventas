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
      lineColor: "#000000",
      dash: {
        length: 2,
        space: 2,
      },
    },
  ],
  margin,
});

// Formatea dinero o devuelve "-" si el valor no existe
const dinero = (valor) =>
  valor != null ? FormatearNumeroDinero(valor, "COP", "CO") : "-";

// Fila label / valor para las tablas de información
const filaInfo = (label, valor, opciones = {}) => [
  { text: label, style: "tInfoLabel" },
  {
    text: `${valor}`,
    style: "tInfoValue",
    alignment: "right",
    noWrap: true,
    ...opciones,
  },
];

/**
 * Ticket de abono a crédito.
 *
 * Datos de empresa: logo, direccion_empresa, pais
 * Datos del abono:
 *   fecha, cliente,
 *   credito_maximo_aprobado,
 *   saldo_anterior    -> lo que debía ANTES del abono
 *   debe              -> lo que debe DESPUÉS del abono (nuevo saldo)
 *   credito_disponible -> cupo disponible DESPUÉS del abono
 *   monto, motivo, metodo_pago
 */
const TicketAbonoCredito = async (output, data) => {
  const colorAccento = "#000000";
  const colorBorde = "#000000";

  let logoempresa = null;
  if (data.logo && data.logo !== "-") {
    try {
      const resultado = await urlToBase64(data.logo);
      if (resultado && resultado.startsWith("data:image")) {
        logoempresa = resultado;
      } else {
        console.warn("Logo con formato inválido, se omite del ticket");
      }
    } catch (e) {
      console.warn("No se pudo cargar el logo, se omite en el ticket:", e);
    }
  }

  const content = [
    // El bloque del logo solo se agrega si logoempresa es válido.
    ...(logoempresa
      ? [
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
              hLineColor: () => "#000000",
              vLineColor: () => "#000000",
              paddingLeft: () => 0,
              paddingRight: () => 0,
              paddingTop: () => 0,
              paddingBottom: () => 0,
            },
            margin: [0, 0, 0, 7],
          },
        ]
      : []),
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
              text: "ABONAR CRÉDITO",
              fontSize: 16,
              bold: true,
              alignment: "center",
              color: colorAccento,
              characterSpacing: 1,
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
        widths: [50, "*"],
        body: [
          filaInfo("FECHA", data.fecha || "-"),
          filaInfo("CLIENTE", data.cliente || "-", { noWrap: false }),
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
      table: {
        widths: [130, "*"],
        body: [
          filaInfo(
            "CREDITO MÁXIMO APROBADO",
            dinero(data.credito_maximo_aprobado),
          ),
          filaInfo("SALDO ANTERIOR", dinero(data.saldo_anterior)),
          filaInfo("NUEVO SALDO (DEBE)", dinero(data.debe)),
          filaInfo("CREDITO DISPONIBLE", dinero(data.credito_disponible)),
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
      table: {
        widths: [ANCHO_UTIL / 2, ANCHO_UTIL / 2],
        body: [
          [
            {
              text: "MONTO",
              style: "seccionTitulo",
              alignment: "center",
              margin: [0, 0, 0, 2],
            },
            {
              text: "MÉTODO",
              style: "seccionTitulo",
              alignment: "center",
              margin: [0, 0, 0, 2],
            },
          ],
          [
            {
              text: `${FormatearNumeroDinero(data.monto, "COP", "CO")}`,
              alignment: "center",
              bold: true,
              fontSize: 14,
              color: colorAccento,
            },
            {
              text: `${data.metodo_pago || "Efectivo"}`,
              alignment: "center",
              bold: true,
              fontSize: 9,
              color: "#000000",
              margin: [0, 3, 0, 0],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 0,
      },
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
        hLineColor: () => "#000000",
        vLineColor: () => "#000000",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    },
  ];

  const styles = {
    empresaDato: {
      fontSize: 8,
      alignment: "center",
      color: "#000000",
    },
    seccionTitulo: {
      fontSize: 7.5,
      bold: true,
      color: "#000000",
      characterSpacing: 0.5,
    },
    tInfoLabel: {
      fontSize: 8,
      bold: true,
      color: "#000000",
    },
    tInfoValue: {
      fontSize: 8,
      bold: true,
      color: "#000000",
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

export default TicketAbonoCredito;
