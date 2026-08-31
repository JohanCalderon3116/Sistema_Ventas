import { ConvertirCapitalize, urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
import { FormatearNumeroDinero } from "../utils/Conversiones";
import writtenNumber from "written-number";

writtenNumber.defaults.lang = "es";

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

const TicketVenta = async (output, data) => {
  const filasPago = () => {
    const filas = [];

    if (data.tipo_de_pago === "Efectivo" || data.tipo_de_pago === "Mixto") {
      filas.push([
        {
          text: "EFECTIVO",
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    }

    if (data.tipo_de_pago === "Credito" || data.tipo_de_pago === "Mixto") {
      filas.push([
        {
          text: "CREDITO",
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    }

    if (data.tipo_de_pago === "Tarjeta" || data.tipo_de_pago === "Mixto") {
      filas.push([
        {
          text: "TARJETA",
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    }

    return filas;
  };

  const logoempresa = await urlToBase64(
    !data.logo || data.logo === "-"
      ? "https://i.ibb.co/HLNmDKRK/administracion-de-empresas.gif"
      : data.logo
  );

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
    ...data.productos.map((item) => [
      {
        text: `${item.cantidad}`,
        style: "tProductsBody",
        alignment: "center",
      },
      {
        text: `${ConvertirCapitalize(item.descripcion)}`,
        style: "tProductsDescripcion",
        alignment: "left",
        noWrap: false,
      },
      {
        text: `${FormatearNumeroDinero(item.precio_venta, "COP", "CO")}`,
        style: "tProductsBody",
        alignment: "right",
        noWrap: true,
      },
      {
        text: `${FormatearNumeroDinero(item.total, "COP", "CO")}`,
        style: "tProductsBody",
        alignment: "right",
        noWrap: true,
      },
    ]),
  ];

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
      text: `${data.nombre}`,
      style: "empresaNombre",
      margin: [0, 2, 0, 1],
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
    {
      table: {
        widths: [ANCHO_UTIL],
        body: [
          [
            {
              stack: [
                {
                  text: `${data.nombre_comprobante}`,
                  style: "comprobanteTipo",
                },
                {
                  text: `${data.id_venta}`,
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
        hLineColor: () => "#cccccc",
        vLineColor: () => "#cccccc",
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
              text: `${data.fecha}   ${data.hora}`,
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
              text: `${data.nombre_usuario}`,
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
              text: `${data.nombre_cliente}`,
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
              text: `${data.cc}`,
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
              text: `${data.direccion_cliente}`,
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
          return i === 1 || i === node.table.body.length ? 1 : 0.5;
        },
        vLineWidth: () => 0,
        hLineColor: function (i) {
          return i === 1 ? "#333333" : "#dcdcdc";
        },
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
              text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
              style: "tTotalValue",
            },
          ],
          [
            {
              text: "TOTAL",
              style: "tTotalLabelGrande",
            },
            {
              text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
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
      text: `SON ${writtenNumber(data.monto_total).toUpperCase()} PESOS`,
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
        body: [
          [
            {
              text: `${data.tipo_de_pago}`,
              style: "tPagoTipo",
            },
            {
              text: "",
              style: "tPagoLabel",
            },
          ],
          ...filasPago(),
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
      text: `${data.pie_pagina} - SoftCrate POS`,
      style: "text",
      alignment: "center",
      margin: [0, 2, 0, 0],
    },
    {
      stack: [
        {
          qr: `Factura: ${data.id_venta}
Cliente: ${data.nombre_cliente}
Total: ${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          fit: 95,
          alignment: "center",
          margin: [0, 10, 0, 4],
        },
        {
          text: "ESCANEAME PARA SOPORTE O PEDIDOS",
          fontSize: 6,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `WhatsApp: wa.me/57${data.telefono}`,
          link:
            `https://wa.me/57${data.telefono}` +
            `?text=Hola!%20Tengo%20una%20duda%20con%20mi%20compra%20%23${data.id_venta}`,
          style: "link",
        },
      ],
    },
  ];

  const styles = {
    empresaNombre: {
      fontSize: 11,
      bold: true,
      alignment: "center",
    },
    empresaDato: {
      fontSize: 8,
      alignment: "center",
      color: "#555555",
    },
    comprobanteTipo: {
      fontSize: 9,
      bold: true,
      alignment: "center",
      characterSpacing: 1,
    },
    comprobanteId: {
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
    tProductsHeader: {
      fontSize: 7.5,
      bold: true,
      fillColor: "#f0f0f0",
    },
    tProductsBody: {
      fontSize: 7.5,
    },
    tProductsDescripcion: {
      fontSize: 8.5,
      margin: [0, 1, 0, 1],
    },
    tTotalLabel: {
      fontSize: 9,
      alignment: "left",
    },
    tTotalValue: {
      fontSize: 9,
      alignment: "right",
      noWrap: true,
    },
    tTotalLabelGrande: {
      fontSize: 11,
      bold: true,
      alignment: "left",
    },
    tTotalValueGrande: {
      fontSize: 11,
      bold: true,
      alignment: "right",
      noWrap: true,
    },
    importeLetras: {
      fontSize: 7.5,
      italics: true,
      alignment: "center",
      color: "#555555",
    },
    tPagoTipo: {
      fontSize: 9,
      bold: true,
    },
    tPagoLabel: {
      fontSize: 8,
      color: "#555555",
    },
    tPagoValue: {
      fontSize: 8,
      bold: true,
      alignment: "right",
      noWrap: true,
    },
    text: {
      fontSize: 8,
    },
    link: {
      fontSize: 8,
      bold: true,
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
      pageMargins: [
        MARGEN,
        MARGEN,
        MARGEN,
        MARGEN,
      ],
      content,
      styles,
    },
    output
  );

  return response;
};

export default TicketVenta;