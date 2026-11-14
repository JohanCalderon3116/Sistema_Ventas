export function ConvertirCapitalize(input) {
  if (!input) return "";
  const texto = String(input);
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}
export function ConvertirMinusculas(input) {
  if (!input) return "";
  return String(input).toLowerCase();
}

export function ConvertirMayusculas(input) {
  if (!input) return "";
  return String(input).toUpperCase();
}

export function FormatearNumeroDinero(numero, currency, iso) {
  if (currency === undefined) {
    return;
  }
  const esiso = "es-" + iso;
  const numeroconvertido = numero.toLocaleString(esiso, {
    style: "currency",
    currency: `${currency}`,
  });
  return numeroconvertido;
}

export function FormatearNumeroDineroSinIsoYCurrency(numero) {
  return Number(numero).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const obtenerBlobImagen = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, {
      mode: "cors",
      cache: "no-store",
    });
    if (response.ok) {
      return await response.blob();
    }
  } catch {
    // Fallback al fetch estándar si cache: "no-store" falla en algún entorno
  }
  const fallbackResponse = await fetch(imageUrl);
  if (!fallbackResponse.ok) {
    throw new Error(`HTTP ${fallbackResponse.status}`);
  }
  return await fallbackResponse.blob();
};

export const urlToBase64 = async (imageUrl) => {
  const blob = await obtenerBlobImagen(imageUrl);
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const prepararLogoTicket = async (imageUrl) => {
  if (!imageUrl || imageUrl === "-") return null;

  const blob = await obtenerBlobImagen(imageUrl);

  if (typeof document === "undefined" || typeof Image === "undefined") {
    return await urlToBase64(imageUrl);
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);
        const w = img.naturalWidth || img.width || 300;
        const h = img.naturalHeight || img.height || 300;

        // Escalar a un tamaño de trabajo óptimo para procesar rápido sin perder nitidez
        const maxWorkDim = 700;
        const scale = Math.min(1, maxWorkDim / Math.max(w, h));
        const workW = Math.max(1, Math.round(w * scale));
        const workH = Math.max(1, Math.round(h * scale));

        const workCanvas = document.createElement("canvas");
        workCanvas.width = workW;
        workCanvas.height = workH;
        const workCtx = workCanvas.getContext("2d", {
          willReadFrequently: true,
        });

        // Fondo blanco puro para evitar transparencias negras en pdfMake
        workCtx.fillStyle = "#FFFFFF";
        workCtx.fillRect(0, 0, workW, workH);
        workCtx.drawImage(img, 0, 0, workW, workH);

        const imgData = workCtx.getImageData(0, 0, workW, workH);
        const data = imgData.data;

        let minX = workW;
        let minY = workH;
        let maxX = 0;
        let maxY = 0;
        let foundContent = false;

        // 1. Detectar bordes reales del contenido y mejorar el contraste para impresión térmica
        // Usamos min(R, G, B) para que logos claros/dorados/amarillos tengan trazos oscuros y nítidos
        for (let y = 0; y < workH; y++) {
          for (let x = 0; x < workW; x++) {
            const idx = (y * workW + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const minCh = Math.min(r, g, b);

            if (minCh < 240) {
              foundContent = true;
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;

              // Curva de alto contraste para impresora térmica (oscurece tonos medios/claros como dorado)
              const norm = minCh / 240;
              let gris = Math.round(Math.pow(norm, 2.6) * 255);
              if (gris < 165) {
                gris = Math.max(0, Math.round(gris * 0.45));
              }
              data[idx] = gris;
              data[idx + 1] = gris;
              data[idx + 2] = gris;
              data[idx + 3] = 255;
            } else {
              // Blanco puro en el fondo para evitar recuadros grises al imprimir
              data[idx] = 255;
              data[idx + 1] = 255;
              data[idx + 2] = 255;
              data[idx + 3] = 255;
            }
          }
        }

        workCtx.putImageData(imgData, 0, 0);

        // 2. Recortar márgenes blancos excesivos alrededor del logo dejando un margen limpio del 6%
        if (foundContent && maxX >= minX && maxY >= minY) {
          const contentW = maxX - minX + 1;
          const contentH = maxY - minY + 1;
          const padX = Math.max(4, Math.round(contentW * 0.06));
          const padY = Math.max(4, Math.round(contentH * 0.06));

          const cropX = Math.max(0, minX - padX);
          const cropY = Math.max(0, minY - padY);
          const cropW = Math.min(workW - cropX, contentW + padX * 2);
          const cropH = Math.min(workH - cropY, contentH + padY * 2);

          const outCanvas = document.createElement("canvas");
          outCanvas.width = cropW;
          outCanvas.height = cropH;
          const outCtx = outCanvas.getContext("2d");
          outCtx.fillStyle = "#FFFFFF";
          outCtx.fillRect(0, 0, cropW, cropH);
          outCtx.drawImage(
            workCanvas,
            cropX,
            cropY,
            cropW,
            cropH,
            0,
            0,
            cropW,
            cropH,
          );
          resolve(outCanvas.toDataURL("image/png"));
          return;
        }

        resolve(workCanvas.toDataURL("image/png"));
      } catch {
        urlToBase64(imageUrl)
          .then(resolve)
          .catch(() => resolve(null));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      urlToBase64(imageUrl)
        .then(resolve)
        .catch(() => resolve(null));
    };

    img.src = objectUrl;
  });
};
