import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import printJS from "print-js";
const ALTO_MAXIMO_HOJA_TERMICA = 595.28; // 210 mm en puntos PDF (estándar por defecto POS-80C)

const clonarNodoPdf = (valor) => {
  if (Array.isArray(valor)) {
    return valor.map(clonarNodoPdf);
  }
  if (valor && typeof valor === "object") {
    const copia = {};
    for (const clave of Object.keys(valor)) {
      copia[clave] = clonarNodoPdf(valor[clave]);
    }
    return copia;
  }
  return valor;
};

const medirAltoDocumento = (docDefinition) => {
  try {
    const docMedicion = clonarNodoPdf(docDefinition);
    const instancia = pdfMake.createPdf(docMedicion);
    let altoCalculado = 0;
    instancia._createDoc({}, (pdfKitDoc) => {
      altoCalculado = pdfKitDoc?.page?.height || 0;
    });
    return altoCalculado;
  } catch {
    return 0;
  }
};

const createPdf = async (props, output = "print") => {
  return new Promise((resolve, reject) => {
    try {
      const {
        pageSize = {
          width: 204.09,
          height: "auto",
        },
        pageMargins = [6, 5, 18, 6],
        pageOrientation = "portrait",
        defaultStyle = {},
        info = {},
        styles = {},
        content,
      } = props;

      let pageSizeFinal = pageSize;

      const docDefinitionBase = {
        pageSize: pageSizeFinal,
        pageMargins,
        pageOrientation,
        defaultStyle,
        info,
        styles,
        content,
      };

      // Si el alto es "auto" y el ticket supera los 210 mm (595.28 pt) del perfil por defecto de la impresora,
      // se pagina automáticamente en bloques de 210 mm para que la impresora térmica imprima todo el rollo
      // continuo sin cortar el final ni obligar al usuario a cambiar dimensiones manualmente.
      if (
        pageSize &&
        typeof pageSize === "object" &&
        pageSize.height === "auto"
      ) {
        const altoTotal = medirAltoDocumento(docDefinitionBase);
        if (altoTotal > ALTO_MAXIMO_HOJA_TERMICA) {
          pageSizeFinal = {
            width: pageSize.width,
            height: ALTO_MAXIMO_HOJA_TERMICA,
          };
        }
      }

      const docDefinition = {
        ...docDefinitionBase,
        pageSize: pageSizeFinal,
      };

      if (output === "b64") {
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          resolve({
            success: true,
            content: data,
            message: "Archivo generado correctamente",
          });
        });
        return;
      } else if (output === "print") {
        //Enviar a impresion directa
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          printJS({
            printable: data,
            type: "pdf",
            base64: true,
          });
          resolve({
            success: true,
            content: null,
            message: "Documnero enviado a impresion",
          });
        });

        return;
      }
      reject({
        success: false,
        content: null,
        message: "Debes enviar tipo de salida",
      });
    } catch (error) {
      reject({
        success: false,
        content: null,
        message: error?.message ?? "No se pude generar el proceso",
      });
    }
  });
};

export default createPdf;
