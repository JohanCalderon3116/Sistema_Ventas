import {
  ConvertirMayusculas,
  FormatearNumeroDinero,
  prepararLogoTicket,
} from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
import writtenNumber from "written-number";

writtenNumber.defaults.lang = "es";

// Ancho nominal de rollo térmico de 80mm (72.0 mm = 204.09 pt)
// Márgenes asimétricos seguros para evitar corte a la derecha en impresoras POS-80C
const ANCHO_PAGINA = 204.09;
const MARGEN_IZQ = 6;
const MARGEN_DER = 18;
const MARGEN_SUP = 5;
const MARGEN_INF = 6;
const ANCHO_UTIL = ANCHO_PAGINA - MARGEN_IZQ - MARGEN_DER;

const NEGRO = "#000000";

const limpiarTexto = (valor, fallback = "") => {
  if (valor === null || valor === undefined) return fallback;
  const texto = String(valor).trim();
  if (!texto || texto === "-") return fallback;
  return texto;
};

const formatearDescripcionProducto = (descripcion) => {
  const texto = ConvertirMayusculas(limpiarTexto(descripcion, "-")).replace(
    /\s+/g,
    " ",
  );
  return texto
    .split(" ")
    .map((palabra) =>
      palabra.length > 22 ? palabra.replace(/(.{18})/g, "$1 ") : palabra,
    )
    .join(" ");
};

const lineaPunteada = (margin = [0, 4, 0, 4]) => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: ANCHO_UTIL,
      y2: 0,
      lineWidth: 0.8,
      lineColor: NEGRO,
      dash: {
        length: 2,
        space: 2,
      },
    },
  ],
  margin,
});

const lineaSolida = (grosor = 1, margin = [0, 3, 0, 3]) => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: ANCHO_UTIL,
      y2: 0,
      lineWidth: grosor,
      lineColor: NEGRO,
    },
  ],
  margin,
});

const TicketVentaModal = async (output, data) => {
  const montoTotal = Number(data?.monto_total) || 0;
  const totalOriginal = Number(data?.total_original) || montoTotal;
  const descuentoValor = Number(data?.descuento_valor) || 0;
  const descuentoPorcentaje = Number(data?.descuento_porcentaje) || 0;
  const vuelto = Number(data?.vuelto) || 0;
  const formasPago = Array.isArray(data?.formas_pago) ? data.formas_pago : [];
  const esMixto = formasPago.length > 1;

  const filasPago = () => {
    const filas = [];

    if (esMixto) {
      filas.push([
        {
          text: "MODALIDAD",
          style: "tPagoLabel",
        },
        {
          text: "MIXTO",
          style: "tPagoValue",
        },
      ]);
    }

    if (formasPago.length > 0) {
      formasPago.forEach((fp) => {
        filas.push([
          {
            text: ConvertirMayusculas(limpiarTexto(fp?.metodo, "PAGO")),
            style: "tPagoLabel",
          },
          {
            text: `${FormatearNumeroDinero(Number(fp?.monto) || 0, "COP", "CO")}`,
            style: "tPagoValue",
          },
        ]);
      });
    } else {
      filas.push([
        {
          text: ConvertirMayusculas(limpiarTexto(data?.tipo_de_pago, "PAGO")),
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(montoTotal, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    }

    if (vuelto > 0) {
      filas.push([
        {
          text: "CAMBIO / VUELTO",
          style: "tPagoLabel",
        },
        {
          text: `${FormatearNumeroDinero(vuelto, "COP", "CO")}`,
          style: "tPagoValue",
        },
      ]);
    }

    return filas;
  };

  let logoempresa = null;
  if (data?.logo && data.logo !== "-") {
    try {
      const resultado = await prepararLogoTicket(data.logo);
      if (resultado && resultado.startsWith("data:image")) {
        logoempresa = resultado;
      }
    } catch (e) {
      console.warn("No se pudo cargar el logo, se omite en el ticket:", e);
    }
  }

  const productos = Array.isArray(data?.productos) ? data.productos : [];
  const totalUnidades = productos.reduce(
    (acc, item) => acc + (Number(item?.cantidad) || 0),
    0,
  );

  const productTableBody = [
    [
      {
        text: "CANT",
        style: "tProductsHeader",
        alignment: "center",
      },
      {
        text: "DESCRIPCIÓN",
        style: "tProductsHeader",
        alignment: "left",
      },
      {
        text: "V.UNIT",
        style: "tProductsHeader",
        alignment: "right",
      },
      {
        text: "TOTAL",
        style: "tProductsHeader",
        alignment: "right",
      },
    ],
    ...productos.map((item) => [
      {
        text: `${item?.cantidad ?? 1}`,
        style: "tProductsBody",
        alignment: "center",
        noWrap: true,
      },
      {
        text: formatearDescripcionProducto(item?.descripcion),
        style: "tProductsDescripcion",
        alignment: "left",
        noWrap: false,
      },
      {
        text: `${FormatearNumeroDinero(Number(item?.precio_venta) || 0, "COP", "CO")}`,
        style: "tProductsBody",
        alignment: "right",
        noWrap: true,
      },
      {
        text: `${FormatearNumeroDinero(
          Number(item?.subtotal ?? item?.total) || 0,
          "COP",
          "CO",
        )}`,
        style: "tProductsBody",
        alignment: "right",
        noWrap: true,
      },
    ]),
  ];

  const nombreEmpresa = ConvertirMayusculas(
    limpiarTexto(data?.nombre_empresa || data?.nombre, "EMPRESA"),
  );
  const nitEmpresa = limpiarTexto(data?.id_fiscal);
  const direccionEmpresa = limpiarTexto(data?.direccion_empresa);
  const paisEmpresa = limpiarTexto(data?.pais);
  const telefonoEmpresa = limpiarTexto(data?.telefono);
  const nombreComprobante = ConvertirMayusculas(
    limpiarTexto(data?.nombre_comprobante, "TICKET DE VENTA"),
  );
  const nroComprobante = limpiarTexto(
    data?.nro_comprobante || data?.id_venta,
    "-",
  );
  const nombreCliente = ConvertirMayusculas(
    limpiarTexto(data?.nombre_cliente, "CLIENTE GENERAL"),
  );
  const ccCliente = limpiarTexto(data?.cc, "-");
  const direccionCliente = limpiarTexto(data?.direccion_cliente, "-");
  const nombreCajero = ConvertirMayusculas(
    limpiarTexto(data?.nombre_usuario, "-"),
  );
  const piePagina = limpiarTexto(data?.pie_pagina, "GRACIAS POR SU COMPRA");

  const datosEmpresaSubtitulo = [
    nitEmpresa ? `NIT: ${nitEmpresa}` : null,
    direccionEmpresa ? direccionEmpresa : null,
    telefonoEmpresa ? `TEL: ${telefonoEmpresa}` : null,
    paisEmpresa ? ConvertirMayusculas(paisEmpresa) : null,
  ].filter(Boolean);

  const filasTotales = [
    [
      {
        text: `SUBTOTAL (${totalUnidades || productos.length} ${
          (totalUnidades || productos.length) === 1 ? "UND" : "UNDS"
        })`,
        style: "tTotalLabel",
      },
      {
        text: `${FormatearNumeroDinero(
          descuentoValor > 0 ? totalOriginal : montoTotal,
          "COP",
          "CO",
        )}`,
        style: "tTotalValue",
      },
    ],
  ];

  if (descuentoValor > 0) {
    filasTotales.push([
      {
        text:
          descuentoPorcentaje > 0
            ? `DESCUENTO (${descuentoPorcentaje}%)`
            : "DESCUENTO",
        style: "tTotalLabel",
      },
      {
        text: `- ${FormatearNumeroDinero(descuentoValor, "COP", "CO")}`,
        style: "tTotalValue",
      },
    ]);
  }

  filasTotales.push([
    {
      text: "TOTAL A PAGAR",
      style: "tTotalLabelGrande",
      margin: [0, 2, 0, 0],
    },
    {
      text: `${FormatearNumeroDinero(montoTotal, "COP", "CO")}`,
      style: "tTotalValueGrande",
      margin: [0, 2, 0, 0],
    },
  ]);

  const content = [
    // Encabezado con Logo y Datos de la Empresa
    ...(logoempresa
      ? [
          {
            image: logoempresa,
            fit: [118, 48],
            alignment: "center",
            margin: [0, 0, 0, 3],
          },
        ]
      : []),
    {
      text: nombreEmpresa,
      style: "empresaNombre",
      margin: [0, 0, 0, 1],
    },
    ...datosEmpresaSubtitulo.map((linea, idx) => ({
      text: linea,
      style: "empresaDato",
      margin: [0, 0, 0, idx === datosEmpresaSubtitulo.length - 1 ? 4 : 0.5],
    })),

    // Recuadro del Comprobante
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: nombreComprobante,
                  style: "comprobanteTipo",
                },
                {
                  text: `N° ${nroComprobante}`,
                  style: "comprobanteId",
                  margin: [0, 1, 0, 0],
                },
              ],
              alignment: "center",
              margin: [0, 3, 0, 3],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => NEGRO,
        vLineColor: () => NEGRO,
        paddingLeft: () => 2,
        paddingRight: () => 2,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 4],
    },

    // Datos de la Venta y Cliente
    {
      table: {
        widths: [46, "*"],
        body: [
          [
            { text: "FECHA:", style: "tInfoLabel" },
            {
              text: `${data?.fecha || ""} ${data?.hora || ""}`.trim(),
              style: "tInfoValue",
              alignment: "right",
            },
          ],
          [
            { text: "CAJERO:", style: "tInfoLabel" },
            {
              text: nombreCajero,
              style: "tInfoValue",
              alignment: "right",
            },
          ],
          [
            { text: "CLIENTE:", style: "tInfoLabel" },
            {
              text: nombreCliente,
              style: "tInfoValue",
              alignment: "right",
            },
          ],
          [
            { text: "C.C / NIT:", style: "tInfoLabel" },
            {
              text: ccCliente,
              style: "tInfoValue",
              alignment: "right",
            },
          ],
          ...(direccionCliente && direccionCliente !== "-"
            ? [
                [
                  { text: "DIRECCIÓN:", style: "tInfoLabel" },
                  {
                    text: ConvertirMayusculas(direccionCliente),
                    style: "tInfoValue",
                    alignment: "right",
                  },
                ],
              ]
            : []),
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingTop: () => 1.2,
        paddingBottom: () => 1.2,
        paddingLeft: () => 0,
        paddingRight: () => 0,
      },
      margin: [0, 0, 0, 3],
    },

    // Tabla de Productos (en MAYÚSCULAS y con control de desbordamiento)
    {
      table: {
        widths: [18, "*", 38, 42],
        headerRows: 1,
        dontBreakRows: true,
        body: productTableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === 1 || i === node.table.body.length) return 1;
          return 0.4;
        },
        vLineWidth: () => 0,
        hLineColor: () => NEGRO,
        hLineStyle: function (i, node) {
          if (i > 1 && i < node.table.body.length) {
            return { dash: { length: 1.5, space: 1.5 } };
          }
          return null;
        },
        paddingLeft: (i) => (i === 0 ? 0 : 1.5),
        paddingRight: (i, node) =>
          i === node.table.widths.length - 1 ? 0 : 1.5,
        paddingTop: (i) => (i === 0 ? 2.5 : 2.5),
        paddingBottom: (i) => (i === 0 ? 2.5 : 2.5),
      },
    },

    // Bloque de Totales y Forma de Pago
    {
      unbreakable: true,
      stack: [
        {
          margin: [0, 4, 0, 2],
          table: {
            widths: ["*", "auto"],
            body: filasTotales,
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingTop: () => 1.5,
            paddingBottom: () => 1.5,
            paddingLeft: () => 0,
            paddingRight: () => 0,
          },
        },
        lineaSolida(1, [0, 1, 0, 3]),
        {
          text: `SON: ${writtenNumber(Math.round(montoTotal)).toUpperCase()} PESOS M/CTE`,
          style: "importeLetras",
          margin: [0, 0, 0, 3],
        },
        lineaPunteada([0, 1, 0, 3]),
        {
          text: "DETALLE DE PAGO",
          style: "seccionTitulo",
          margin: [0, 0, 0, 2],
        },
        {
          table: {
            widths: ["*", "auto"],
            body: filasPago(),
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingTop: () => 1.2,
            paddingBottom: () => 1.2,
            paddingLeft: () => 0,
            paddingRight: () => 0,
          },
        },
        lineaPunteada([0, 3, 0, 4]),
      ],
    },

    // Pie de Página y Código QR compacto
    {
      unbreakable: true,
      stack: [
        {
          text: `${piePagina} • SoftCreate POS`,
          style: "footerText",
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          qr: `Factura: ${nroComprobante}\nCliente: ${nombreCliente}\nTotal: ${FormatearNumeroDinero(montoTotal, "COP", "CO")}`,
          fit: 68,
          alignment: "center",
          margin: [0, 2, 0, 3],
        },
        {
          text: "ESCANÉAME PARA SOPORTE O PEDIDOS",
          style: "qrCaption",
          margin: [0, 0, 0, 2],
        },
        ...(telefonoEmpresa
          ? [
              {
                text: `WhatsApp: wa.me/57${telefonoEmpresa}`,
                link:
                  `https://wa.me/57${telefonoEmpresa}` +
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
      fontSize: 10,
      bold: true,
      color: NEGRO,
      alignment: "center",
      lineHeight: 1.05,
    },
    empresaDato: {
      fontSize: 7.2,
      bold: true,
      alignment: "center",
      color: NEGRO,
    },
    comprobanteTipo: {
      fontSize: 8.5,
      bold: true,
      color: NEGRO,
      alignment: "center",
      characterSpacing: 0.6,
    },
    comprobanteId: {
      fontSize: 8,
      bold: true,
      alignment: "center",
      color: NEGRO,
    },
    seccionTitulo: {
      fontSize: 7,
      bold: true,
      color: NEGRO,
      characterSpacing: 0.4,
    },
    tInfoLabel: {
      fontSize: 7.2,
      bold: true,
      color: NEGRO,
    },
    tInfoValue: {
      fontSize: 7.2,
      bold: true,
      color: NEGRO,
      lineHeight: 1.05,
    },
    tProductsHeader: {
      fontSize: 7,
      bold: true,
      color: NEGRO,
      fillColor: "#ffffff",
    },
    tProductsBody: {
      fontSize: 7,
      bold: true,
      color: NEGRO,
    },
    tProductsDescripcion: {
      fontSize: 7,
      bold: true,
      color: NEGRO,
      lineHeight: 1.05,
    },
    tTotalLabel: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
      alignment: "left",
    },
    tTotalValue: {
      fontSize: 8,
      bold: true,
      color: NEGRO,
      alignment: "right",
      noWrap: true,
    },
    tTotalLabelGrande: {
      fontSize: 10,
      bold: true,
      color: NEGRO,
      alignment: "left",
    },
    tTotalValueGrande: {
      fontSize: 10,
      bold: true,
      color: NEGRO,
      alignment: "right",
      noWrap: true,
    },
    importeLetras: {
      fontSize: 6.8,
      bold: true,
      italics: true,
      alignment: "center",
      color: NEGRO,
      lineHeight: 1.05,
    },
    tPagoLabel: {
      fontSize: 7.4,
      bold: true,
      color: NEGRO,
    },
    tPagoValue: {
      fontSize: 7.4,
      bold: true,
      color: NEGRO,
      alignment: "right",
      noWrap: true,
    },
    footerText: {
      fontSize: 7.2,
      bold: true,
      color: NEGRO,
    },
    qrCaption: {
      fontSize: 6,
      bold: true,
      color: NEGRO,
      alignment: "center",
    },
    link: {
      fontSize: 7,
      bold: true,
      color: NEGRO,
      margin: [0, 0, 0, 2],
      alignment: "center",
    },
  };

  const response = await createPdf(
    {
      pageSize: {
        width: ANCHO_PAGINA,
        height: "auto",
      },
      pageMargins: [MARGEN_IZQ, MARGEN_SUP, MARGEN_DER, MARGEN_INF],
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
