import { useQuery } from "@tanstack/react-query";
import { ConvertirCapitalize, urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
import { useVentasStore } from "../store/VentasStore";
import { useDetalleVentasStore } from "../store/DetalleVentasStore";
import { FormatearNumeroDinero } from "../utils/Conversiones";
import writtenNumber from "written-number";
writtenNumber.defaults.lang = "es";
const TicketVenta = async (output, data) => {
  // función fuera del content
  const filasPago = () => {
    const filas = [];

    if (data.tipo_de_pago === "Efectivo" || data.tipo_de_pago === "Mixto") {
      filas.push([
        { text: "EFECTIVO: $", style: "tTotals", colSpan: 2 },
        {},
        {
          text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          style: "tTotals",
          colSpan: 2,
        },
        {},
      ]);
    }

    if (data.tipo_de_pago === "Credito" || data.tipo_de_pago === "Mixto") {
      filas.push([
        { text: "CREDITO: $", style: "tTotals", colSpan: 2 },
        {},
        {
          text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          style: "tTotals",
          colSpan: 2,
        },
        {},
      ]);
    }

    if (data.tipo_de_pago === "Tarjeta" || data.tipo_de_pago === "Mixto") {
      filas.push([
        { text: "TARJETA: $", style: "tTotals", colSpan: 2 },
        {},
        {
          text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          style: "tTotals",
          colSpan: 2,
        },
        {},
      ]);
    }

    return filas;
  };
  const logoempresa = await urlToBase64(
    !data.logo || data.logo === "-"
      ? "https://i.ibb.co/HLNmDKRK/administracion-de-empresas.gif"
      : data.logo,
  );
  const productTableBody = [
    // encabezados
    [
      { text: "CT", style: "tProductsHeader" },
      { text: "DESCRIPCION", style: "tProductsHeader", alignment: "center" },
      { text: "P.UN", style: "tProductsHeader", alignment: "right" },
      { text: "TOT", style: "tProductsHeader", alignment: "right" },
    ],
    // productos
    // productos
    ...data.productos.map((item) => [
      { text: `${item.cantidad}`, style: "tProductsBody", alignment: "center" },
      {
        text: `${ConvertirCapitalize(item.descripcion)}`,
        style: "tProductsDescripcion",
        alignment: "left",
      },
      {
        text: `${FormatearNumeroDinero(item.precio_venta, "COP", "CO")}`,
        style: "tProductsBody",
        alignment: "right",
      },
      {
        text: `${FormatearNumeroDinero(item.total, "COP", "CO")}`,
        style: "tProductsBody",
        alignment: "right",
      },
    ]),
  ];
  const content = [
    {
      image: logoempresa,
      fit: [180, 90],
      alignment: "center",
      margin: [0, 0, 0, 5],
    },
    {
      text: `${data.nombre}`,
      style: "header",
      margin: [0, 10, 0, 0],
    },
    {
      text: `${data.direccion_empresa}`,
      style: "header",
    },
    {
      text: `${data.pais}`,
      style: "header",
    },
    {
      text: `${data.nombre_comprobante}`,
      style: "header",
    },
    {
      text: `${data.id_venta}`,
      style: "header",
      margin: [0, 2.25, 0, 2.25],
    },
    {
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            { text: "FECHA", style: "tHeaderLabel" },
            { text: `${data.fecha}`, style: "tHeaderLabel" },
            { text: "HORA", style: "tHeaderLabel" },
            { text: `${data.hora}`, style: "tHeaderLabel" },
          ],
          [
            { text: "CAJERO/A", style: "tHeaderLabel" },
            {
              text: `${data.nombre_usuario}`,
              style: " tHeaderValue",
              fontSize: 8,
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            {
              text: "CLIENTE: ",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
            },
            {},
            {},
            {},
          ],
          [
            {
              text: "NOMBRE:",
              style: "tClientLabel",
            },
            {
              text: `${data.nombre_cliente}`,
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            {
              text: "C.C",
              style: "tClientLabel",
            },
            {
              text: `${data.cc}`,
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            {
              text: "DIRECCION",
              style: "tClientLabel",
            },
            {
              text: `${data.direccion_cliente}`,
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
        ],
      },
      layout: "noBorders",
    },
    //Tabla productos
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["10%", "42%", "24%", "24%"],
        headerRows: 2,
        body: productTableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i == 2 ? 0.5 : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function () {
          return "#a9a9a9";
        },
      },
    },
    //totales
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            {
              text: "SUBTOTAL: $",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          [
            {
              text: "TOTAL: $",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: `${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          // Total en letras
          [
            {
              text: "IMPORTE LETRAS",
              style: "tTotals",
              colSpan: 2,
              alignment: "left",
              margin: [0, 4, 0, 0],
            },
            {},
            {},
            {},
          ],
          [
            {
              text: `SON ${writtenNumber(data.monto_total).toUpperCase()} PESOS`,
              style: "tProductsBody",
              colSpan: 4,
            },
            {},
            {},
            {},
          ],
          //formas de pago
          [
            {
              text: "FORMAS DE PAGO",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
              margin: [0, 4, 0, 0],
            },
            {},
            {},
            {},
          ],
          [
            {
              text: `${data.tipo_de_pago}`,
              style: "tProductsBody",
              colSpan: 4,
            },
            {},
            {},
            {},
          ],
          [
            {
              text: "FORMA DE PAGO: ",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: `${data.tipo_de_pago}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          ...filasPago(),
        ],
      },
      layout: "noBorders",
    },
    //Pie de pagina
    {
      text: `${data.pie_pagina} SoftCrate POS`,
      style: "text",
      alignment: "justify",
      margin: [0, 5],
    },
    //QR
    {
      stack: [
        {
          qr: `Factura: ${data.id_venta}\nCliente: ${data.nombre_cliente}\nTotal: ${FormatearNumeroDinero(data.monto_total, "COP", "CO")}`,
          fit: 130,
          alignment: "center",
          margin: [0, 10, 0, 3],
        },
        {
          text: "ESCANEAME PARA SOPORTE O PEDIDOS",
          fontSize: 6,
          bold: true,
          alignment: "center",
          margin: [0, 2, 0, 0],
        },
        {
          text: `WhatsApp: wa.me/57${data.telefono}`,
          link: `https://wa.me/57${data.telefono}?text=Hola!%20Tengo%20una%20duda%20con%20mi%20compra%20%23${data.id_venta}`,
          style: "link",
        },
      ],
    },
  ];

  const styles = {
    header: {
      fontSize: 9,
      bold: true,
      alignment: "center",
    },
    tHeaderLabel: {
      fontSize: 8,
      alignment: "right",
    },
    tHeaderValue: {
      fontSize: 4,
      bold: true,
    },
    tProductsHeader: {
      fontSize: 8.5,
      bold: true,
    },
    tProductsBody: {
      fontSize: 8,
    },
    tProductsDescripcion: {
      fontSize: 9.5,
    },
    tTotals: {
      fontSize: 9,
      bold: true,
      alignment: "right",
    },
    tClientLabel: {
      fontSize: 8,
      alignment: "right",
    },
    tClientValue: {
      fontSize: 8,
      bold: true,
    },
    text: {
      fontSize: 8,
      alignment: "center",
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
      pageSize: { width: 204.09, height: 841.88 },
      pageMargins: [2.83, 5.66, 2.83, 5.66],
      content,
      styles,
    },
    output,
  );
  return response;
};

export default TicketVenta;
