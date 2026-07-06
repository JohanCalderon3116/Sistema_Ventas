import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import printJS from "print-js";
const createPdf = async (props, output = "print") => {
  return new Promise((resolve, reject) => {
    try {
      const {
        pageSize = {
          width: 200.77,
          height: "auto",
        },
        pageMargins = [5.66, 5.66, 5.66, 5.66],
        info = {},
        styles = {},
        content,
      } = props;

      const docDefinition = {
        pageSize, //Tamaño de hoja
        pageMargins, //Margenes de la hoja xd
        info, //Metadata del pdf
        styles, //Estilos del pdf
        content, //Contenido del pdf
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
