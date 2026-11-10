import {
  ConvertirCapitalize,
  FormatearNumeroDinero,
  urlToBase64,
} from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
import writtenNumber from "written-number";

writtenNumber.defaults.lang = "es";

const ANCHO_PAGINA = 204.09;
const MARGEN = 4;
const ANCHO_UTIL = ANCHO_PAGINA - MARGEN * 2;

const NEGRO = "#000000";

const lineaPunteada = (margin = [0, 6, 0, 6]) => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: ANCHO_UTIL,
      y2: 0,
      lineWidth: 1,
      lineColor: NEGRO,
      dash: {
        length: 2,
        space: 2,
      },
    },
  ],
  margin,
});

const TicketVentaModal = async (output, data) => {
  const formasPago = Array.isArray(data?.formas_pago) ? data.formas_pago : [];
  const esMixto = formasPago.length > 1;

  const filasPago = () => {
    const filas = [];

    if (esMixto) {
      filas.push([
        {
          text: "MIXTO",
          style: "tPagoTipo",
        },
        {
          text: "",
          style: "tPagoLabel",
        },
      ]);
    }

    formasPago.forEach((fp) => {
      filas.push([
        {
          text: `${(fp?.metodo || "PAGO").toUpperCase()}`,
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(fp?.monto || 0, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    });

    if (Number(data?.vuelto) > 0) {
      filas.push([
        {
          text: "VUELTO",
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(data.vuelto, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    }

    return filas;
  };

  let logoempresa = null;
  if (data?.logo && data.logo !== "-") {
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

  const productos = Array.isArray(data?.productos) ? data.productos : [];

  const productTableBody = [
    [
      {
        text: "C",
        style: "tProductsHeader",
        alignment: "center",
      },
      {
        text: "DESCRIPCIÓN",
        style: "tProductsHeader",
        alignment: "left",
      },
      {
        text: "P.UN",
        style: "tProductsHeader",
        alignment: "right",
      },
      {
        text: "TOT",
        style: "tProductsHeader",
        alignment: "right",
      },
    ],
    ...productos.map((item) => [
      {
        text: `${item?.cantidad ?? 1}`,
        style: "tProductsBody",
        alignment: "center",
      },
      {
        text: `${ConvertirCapitalize(item?.descripcion || "-")}`,
        style: "tProductsDescripcion",
        alignment: "left",
        noWrap: false,
      },
      {
        text: `${FormatearNumeroDinero(item?.precio_venta || 0, "COP", "CO")}`,
        style: "tProductsBody",
        alignment: "right",
        noWrap: true,
      },
      {
        text: `${FormatearNumeroDinero(
          item?.subtotal ?? item?.total ?? 0,
          "COP",
          "CO",
        )}`,
        style: "tProductsBody",
        alignment: "right",
        noWrap: true,
      },
    ]),
  ];

  const montoTotal = Number(data?.monto_total) || 0;
  const nroComprobante = data?.nro_comprobante || data?.id_venta || "-";
  const nombreEmpresa = data?.nombre_empresa || data?.nombre || "";
  const direccionEmpresa = data?.direccion_empresa || "";
  const paisEmpresa = data?.pais || "";

  const content = [
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
              hLineColor: () => NEGRO,
              vLineColor: () => NEGRO,
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
      text: `${nombreEmpresa}`,
      style: "empresaNombre",
      margin: [0, 2, 0, 1],
    },
    ...(direccionEmpresa
      ? [
          {
            text: `${direccionEmpresa}`,
            style: "empresaDato",
          },
        ]
      : []),
    {
      text: `${paisEmpresa}`,
      style: "empresaDato",
      margin: [0, 0, 0, 6],
    },
    {
      table: {
        widths: [ANCHO_UTIL],
        body: [
          [
            {
              stack: [
                {
                  text: `${data?.nombre_comprobante || "COMPROBANTE"}`,
                  style: "comprobanteTipo",
                },
                {
                  text: `${nroComprobante}`,
                  style: "comprobanteId",
                  margin: [0, 1, 0, 0],
                },
              ],
              alignment: "center",
              margin: [0, 5, 0, 5],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => NEGRO,
        vLineColor: () => NEGRO,
        paddingLeft: () => 0,
        paddingRight: () => 0,
      },
      margin: [0, 0, 0, 6],
    },
    lineaPunteada([0, 0, 0, 6]),
    {
      table: {
        widths: [45, "*"],
        body: [
          [
            {
              text: "FECHA",
              style: "tInfoLabel",
            },
            {
              text: `${data?.fecha || ""}   ${data?.hora || ""}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: true,
            },
          ],
          [
            {
              text: "CAJERO",
              style: "tInfoLabel",
            },
            {
              text: `${data?.nombre_usuario || "-"}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: false,
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
      text: "CLIENTE",
      style: "seccionTitulo",
      margin: [0, 0, 0, 4],
    },
    {
      table: {
        widths: [45, "*"],
        body: [
          [
            {
              text: "NOMBRE",
              style: "tInfoLabel",
            },
            {
              text: `${data?.nombre_cliente || "-"}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: false,
            },
          ],
          [
            {
              text: "C.C",
              style: "tInfoLabel",
            },
            {
              text: `${data?.cc || "-"}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: true,
            },
          ],
          [
            {
              text: "DIRECCIÓN",
              style: "tInfoLabel",
            },
            {
              text: `${data?.direccion_cliente || "-"}`,
              style: "tInfoValue",
              alignment: "right",
              noWrap: false,
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
      table: {
        widths: ["9%", "46%", "22.5%", "22.5%"],
        headerRows: 1,
        body: productTableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 1 || i === node.table.body.length ? 1 : 0.75;
        },
        vLineWidth: () => 0,
        hLineColor: () => NEGRO,
        paddingLeft: () => 2,
        paddingRight: () => 2,
        paddingTop: () => 4,
        paddingBottom: () => 4,
      },
    },
    {
      margin: [0, 8, 0, 0],
      table: {
        widths: ["*", "auto"],
        body: [
          [
            {
              text: "SUBTOTAL",
              style: "tTotalLabel",
            },
            {
              text: `${FormatearNumeroDinero(montoTotal, "COP", "CO")}`,
              style: "tTotalValue",
            },
          ],
          [
            {
              text: "TOTAL",
              style: "tTotalLabelGrande",
            },
            {
              text: `${FormatearNumeroDinero(montoTotal, "COP", "CO")}`,
              style: "tTotalValueGrande",
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
    {
      text: `SON ${writtenNumber(Math.round(montoTotal)).toUpperCase()} PESOS`,
      style: "importeLetras",
      margin: [0, 6, 0, 0],
    },
    lineaPunteada(),
    {
      text: "FORMA DE PAGO",
      style: "seccionTitulo",
      margin: [0, 0, 0, 4],
    },
    {
      table: {
        widths: ["*", "auto"],
        body: [...filasPago()],
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
      text: `${data?.pie_pagina || "-"} - SoftCreate POS`,
      style: "text",
      alignment: "center",
      margin: [0, 2, 0, 0],
    },
    {
      stack: [
        {
          qr: `Factura: ${nroComprobante}
Cliente: ${data?.nombre_cliente || "-"}
Total: ${FormatearNumeroDinero(montoTotal, "COP", "CO")}`,
          fit: 95,
          alignment: "center",
          margin: [0, 10, 0, 4],
        },
        {
          text: "ESCANEAME PARA SOPORTE O PEDIDOS",
          fontSize: 6,
          bold: true,
          color: NEGRO,
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        ...(data?.telefono
          ? [
              {
                text: `WhatsApp: wa.me/57${data.telefono}`,
                link:
                  `https://wa.me/57${data.telefono}` +
                  `?text=Hola!%20Tengo%20una%20duda%20con%20mi%20compra%20%23${nroComprobante}`,
                style: "link",
              },
            ]
          : []),
      ],
    },
  ];

  const styles = {
    empresaNombre: {
      fontSize: 11,
      bold: true,
      color: NEGRO,
      alignment: "center",
    },
    empresaDato: {
      fontSize: 8,
      bold: true,
      alignment: "center",
      color: NEGRO,
    },
    comprobanteTipo: {
      fontSize: 9,
      bold: true,
      color: NEGRO,
      alignment: "center",
      characterSpacing: 1,
    },
    comprobanteId: {
      fontSize: 8,
      bold: true,
      alignment: "center",
      color: NEGRO,
    },
    seccionTitulo: {
      fontSize: 7.5,
      bold: true,
      color: NEGRO,
      characterSpacing: 0.5,
    },
    tInfoLabel: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
    },
    tInfoValue: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
    },
    tProductsHeader: {
      fontSize: 7.5,
      bold: true,
      color: NEGRO,
      fillColor: "#ffffff",
    },
    tProductsBody: {
      fontSize: 7.5,
      bold: true,
      color: NEGRO,
    },
    tProductsDescripcion: {
      fontSize: 8.5,
      bold: true,
      color: NEGRO,
      margin: [0, 1, 0, 1],
    },
    tTotalLabel: {
      fontSize: 9,
      bold: true,
      color: NEGRO,
      alignment: "left",
    },
    tTotalValue: {
      fontSize: 9,
      bold: true,
      color: NEGRO,
      alignment: "right",
      noWrap: true,
    },
    tTotalLabelGrande: {
      fontSize: 11,
      bold: true,
      color: NEGRO,
      alignment: "left",
    },
    tTotalValueGrande: {
      fontSize: 11,
      bold: true,
      color: NEGRO,
      alignment: "right",
      noWrap: true,
    },
    importeLetras: {
      fontSize: 7.5,
      bold: true,
      italics: true,
      alignment: "center",
      color: NEGRO,
    },
    tPagoTipo: {
      fontSize: 9,
      bold: true,
      color: NEGRO,
    },
    tPagoLabel: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
    },
    tPagoValue: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
      alignment: "right",
      noWrap: true,
    },
    text: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
    },
    link: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
      margin: [0, 0, 0, 4],
      alignment: "center",
    },
  };

  const response = await createPdf(
    {
      pageSize: {
        width: ANCHO_PAGINA,
        height: "auto",
      },
      pageMargins: [MARGEN, MARGEN, MARGEN, MARGEN],
      defaultStyle: {
        color: NEGRO,
        bold: true,
      },
      content,
      styles,
    },
    output,
  );

  return response;
};

export default TicketVentaModal;
