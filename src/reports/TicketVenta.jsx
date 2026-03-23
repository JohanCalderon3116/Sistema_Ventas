import { urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
const TicketVenta = async (output, data) => {
  const logoempresa = await urlToBase64(data.logo);
  const productTableBody = [
    [
      {
        text: "CODIGO - DESCRIPCION",
        colSpan: 4,
        style: "tProductsHeader",
      },
      {},
      {},
      {},
    ],
    [
      {
        text: "CANT.",
        style: "tProductsHeader",
      },
      {
        text: "UM",
        style: "tProductsHeader",
        alignment: "center",
      },
      {
        text: "PRECIO",
        style: "tProductsHeader",
        alignment: "right",
      },
      {
        text: "TOTAL",
        style: "tProductsHeader",
        alignment: "right",
      },
    ],
    ...data.productos.flatMap((item) => [
      [
        {
          text: ` "CODIGO" - ${item._descripcion} `,
          style: "tProductsBody",
          colSpan: 4,
        },
        {},
        {},
        {},
      ],
      [
        {
          text: `${item._cantidad}`,
          style: "tProductsBody",
          alignment: "center",
        },
        {
          text: "UNIDAD",
          style: "tProductsBody",
          alignment: "center",
        },
        {
          text: `${item._precio_venta}`,
          style: "tProductsBody",
          alignment: "right",
        },
        {
          text: `${item._total}`,
          style: "tProductsBody",
          alignment: "right",
        },
      ],
    ]),
  ];
  const content = [
    {
      //Data de la empresa
      image: logoempresa, //Logo
      fit: [141.73, 56.692],
      alignment: "center",
    },
    {
      text: `${data.nombre}`,
      style: "header",
      margin: [0, 10, 0, 0],
    },
    {
      text: "DIRECCIÓN",
      style: "header",
    },
    {
      text: "RIC EMPRESA",
      style: "header",
    },
    {
      text: "FACTURA ELECTRONICA",
      style: "header",
      margin: [0, 10, 0, 2.25],
    },
    {
      text: "F001-000001",
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
              text: "NOMBRE CAJERO",
              style: " tHeaderValue",
              fontSize: 8,
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            { text: "VENDEDOR", style: "tHeaderLabel" },
            {
              text: "NOMBRE VENDEDOR",
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
              text: "1081274697",
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
              text: `${data.direccion}`,
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
        widths: ["20%", "20%", "30%", "30%"],
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
              text: "45",
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          [
            {
              text: "IVA: $",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: "45",
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
              text: `${data.monto_total}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          //Total en letras
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
              text: "SON CUARENTA Y CINCO",
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
              text: "EFECTIVO: $",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: `${data.efectivo}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          [
            {
              text: "CREDITO: $",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: `${data.credito}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          [
            {
              text: "TARJETA: $",
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: `${data.tarjeta}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
        ],
      },
      layout: "noBorders",
    },
    //Pie de pagina
    {
      text: "¡GRACIAS POR NAVEGAR CON NOSOTROS! EN SURTITODO EL BARCO ENCUENTRAS DE TODO PARA TU HOGAR. CONSERVE ESTE TICKET PARA CUALQUIER CAMBIO O RECLAMACIÓN. LOS CAMBIOS SE REALIZAN DENTRO DE LOS 3 DÍAS SIGUIENTES A LA COMPRA EN PERFECTO ESTADO. ¡VUELVA PRONTO! SOFTCREATE",
      style: "text",
      alignment: "justify",
      margin: [0, 5],
    },
    //QR
    {
      stack: [
        {
          // Aquí concatenamos los datos de la venta para que el QR sea único
          qr: `Factura: F001-000001\nCliente: Generico\nTotal: $45`,
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
          text: "\nWhatsApp: https://wa.me/573000000000?text=Hola%20Surtitodo%20El%20Barco!%20Tengo%20una%20duda%20con%20mi%20compra%20F001-000001",
          link: "\nWhatsApp: https://wa.me/573000000000?text=Hola%20Surtitodo%20El%20Barco!%20Tengo%20una%20duda%20con%20mi%20compra%20F001-000001",
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
  const response = await createPdf({ content, styles }, output);
  return response;
};

export default TicketVenta;
