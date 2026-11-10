import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib";
import { SOFTCREATE_LOGO_PNG_BASE64 } from "./logo.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function sanitizePdfText(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[\u00A0\u202F\u2007]/g, " ")
    .replace(/[•·]/g, "-")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E\xA1-\xFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatMoney(
  value: unknown,
  simbolo = "$",
  currency = "COP",
): string {
  const num = Number(value) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const hasDecimals = Math.round((absNum % 1) * 100) !== 0 && currency !== "COP";
  const fixed = hasDecimals ? absNum.toFixed(2) : Math.round(absNum).toString();
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formattedNumber = decPart ? `${withThousands},${decPart}` : withThousands;
  const cleanSymbol = sanitizePdfText(simbolo || "$") || "$";
  return `${isNegative ? "-" : ""}${cleanSymbol} ${formattedNumber}`;
}

function formatDateTime(value: unknown): string {
  if (!value) return "No registrado";
  const raw = String(value).trim();
  const d = new Date(raw.includes("T") ? raw : raw.replace(" ", "T"));
  if (isNaN(d.getTime())) {
    return sanitizePdfText(raw);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function wrapText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number,
): string[] {
  const clean = sanitizePdfText(text) || "-";
  const words = clean.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);
    if (width <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
        let chunk = "";
        for (const ch of word) {
          if (font.widthOfTextAtSize(chunk + ch, fontSize) <= maxWidth) {
            chunk += ch;
          } else {
            if (chunk) lines.push(chunk);
            chunk = ch;
          }
        }
        currentLine = chunk;
      } else {
        currentLine = word;
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : ["-"];
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const subarray = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(subarray));
  }
  return btoa(binary);
}

export async function buildCierreCajaPdf(payload: {
  empresaNombre: string;
  simboloMoneda: string;
  currency: string;
  sucursalNombre: string;
  cajaNombre: string;
  cajeroNombre: string;
  fechaInicio: string;
  fechaCierre: string;
  totalApertura: number;
  totalVentasEfectivo: number;
  totalIngresos: number;
  totalSalidas: number;
  efectivoEsperado: number;
  efectivoReal: number;
  diferencia: number;
  totalVentasGeneral: number;
  ventasPorMetodo: Array<{ metodo_pago: string; monto: number }>;
  entradasDetalle: Array<{
    fecha_movimiento?: string;
    descripcion?: string;
    monto: number;
  }>;
  salidasDetalle: Array<{
    fecha_movimiento?: string;
    descripcion?: string;
    monto: number;
  }>;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoBytes = base64ToUint8Array(SOFTCREATE_LOGO_PNG_BASE64);
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN_X = 40;
  const CONTENT_W = PAGE_W - MARGIN_X * 2; // 515.28
  const BOTTOM_LIMIT = 65;

  // Palette
  const cDark = rgb(0.07, 0.09, 0.15); // #111827
  const cSlate700 = rgb(0.2, 0.25, 0.33); // #334155
  const cSlate500 = rgb(0.39, 0.45, 0.55); // #64748B
  const cSlate400 = rgb(0.58, 0.64, 0.72); // #94A3B8
  const cBorder = rgb(0.88, 0.91, 0.94); // #E2E8F0
  const cCardBg = rgb(0.97, 0.98, 0.99); // #F8FAFC
  const cRowAlt = rgb(0.985, 0.99, 0.996);
  const cWhite = rgb(1, 1, 1);

  const cBlue = rgb(0.15, 0.39, 0.92); // #2563EB
  const cBlueSoft = rgb(0.93, 0.96, 1.0); // #EFF6FF
  const cBlueBorder = rgb(0.75, 0.86, 0.99);

  const cGreen = rgb(0.08, 0.5, 0.24); // #15803D
  const cGreenSoft = rgb(0.94, 0.99, 0.96); // #F0FDF4
  const cGreenBorder = rgb(0.53, 0.94, 0.67);

  const cRed = rgb(0.73, 0.11, 0.11); // #B91C1C
  const cRedSoft = rgb(0.996, 0.95, 0.95); // #FEF2F2
  const cRedBorder = rgb(0.99, 0.65, 0.65);

  const cAmber = rgb(0.71, 0.33, 0.04); // #B45309
  const cAmberSoft = rgb(1.0, 0.98, 0.92); // #FFFBEB
  const cAmberBorder = rgb(0.99, 0.83, 0.3);

  const fmt = (val: unknown) =>
    formatMoney(val, payload.simboloMoneda, payload.currency);

  const pages: any[] = [];
  let page: any = null;
  let y = 0;

  const diff = Number(payload.diferencia) || 0;
  const isCuadrada = Math.abs(diff) < 0.01;
  const isFaltante = diff < -0.01;

  const statusColor = isCuadrada ? cGreen : isFaltante ? cRed : cAmber;
  const statusSoft = isCuadrada ? cGreenSoft : isFaltante ? cRedSoft : cAmberSoft;
  const statusBorder = isCuadrada
    ? cGreenBorder
    : isFaltante
    ? cRedBorder
    : cAmberBorder;
  const statusLabel = isCuadrada
    ? "CAJA CUADRADA (SIN DIFERENCIAS)"
    : isFaltante
    ? "FALTANTE DE DINERO EN CAJA"
    : "SOBRANTE DE DINERO EN CAJA";

  const drawRightText = (
    p: any,
    text: string,
    rightX: number,
    posY: number,
    size: number,
    font: any,
    color: any,
  ) => {
    const clean = sanitizePdfText(text);
    const w = font.widthOfTextAtSize(clean, size);
    p.drawText(clean, { x: rightX - w, y: posY, size, font, color });
  };

  const addPage = (isFirstPage: boolean) => {
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    pages.push(page);

    // Barra superior elegante
    page.drawRectangle({
      x: 0,
      y: PAGE_H - 8,
      width: PAGE_W,
      height: 8,
      color: cDark,
    });

    if (isFirstPage) {
      // Logo SoftCreate
      const logoW = 152;
      const logoH = 35.8;
      page.drawImage(logoImage, {
        x: MARGIN_X,
        y: PAGE_H - 58,
        width: logoW,
        height: logoH,
      });

      // Título derecha
      drawRightText(
        page,
        "REPORTE DE CIERRE DE CAJA",
        PAGE_W - MARGIN_X,
        PAGE_H - 38,
        15,
        fontBold,
        cDark,
      );

      // Etiqueta de Estado
      const pillTextW = fontBold.widthOfTextAtSize(statusLabel, 8);
      const pillW = pillTextW + 20;
      const pillX = PAGE_W - MARGIN_X - pillW;
      const pillY = PAGE_H - 62;

      page.drawRectangle({
        x: pillX,
        y: pillY,
        width: pillW,
        height: 18,
        color: statusSoft,
        borderColor: statusBorder,
        borderWidth: 1,
      });
      page.drawText(statusLabel, {
        x: pillX + 10,
        y: pillY + 5.5,
        size: 8,
        font: fontBold,
        color: statusColor,
      });

      page.drawLine({
        start: { x: MARGIN_X, y: PAGE_H - 74 },
        end: { x: PAGE_W - MARGIN_X, y: PAGE_H - 74 },
        thickness: 1,
        color: cBorder,
      });

      y = PAGE_H - 92;
    } else {
      const logoW = 100;
      const logoH = 23.5;
      page.drawImage(logoImage, {
        x: MARGIN_X,
        y: PAGE_H - 44,
        width: logoW,
        height: logoH,
      });

      drawRightText(
        page,
        `REPORTE DE CIERRE DE CAJA  -  ${sanitizePdfText(payload.empresaNombre)}`,
        PAGE_W - MARGIN_X,
        PAGE_H - 36,
        9,
        fontBold,
        cSlate700,
      );

      page.drawLine({
        start: { x: MARGIN_X, y: PAGE_H - 52 },
        end: { x: PAGE_W - MARGIN_X, y: PAGE_H - 52 },
        thickness: 0.8,
        color: cBorder,
      });

      y = PAGE_H - 70;
    }
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < BOTTOM_LIMIT) {
      addPage(false);
    }
  };

  addPage(true);

  // =========================================================================
  // 1. DATOS DEL TURNO (CUADRO LIMPIO Y SENCILLO)
  // =========================================================================
  const infoBoxH = 62;
  const infoBoxBottom = y - infoBoxH;

  page.drawRectangle({
    x: MARGIN_X,
    y: infoBoxBottom,
    width: CONTENT_W,
    height: infoBoxH,
    color: cCardBg,
    borderColor: cBorder,
    borderWidth: 1,
  });

  const col1X = MARGIN_X + 14;
  const col2X = MARGIN_X + CONTENT_W / 2 + 10;

  const drawSimpleField = (
    xPos: number,
    yPos: number,
    label: string,
    value: string,
  ) => {
    page.drawText(sanitizePdfText(label), {
      x: xPos,
      y: yPos,
      size: 9,
      font: fontNormal,
      color: cSlate500,
    });
    const wrapped = wrapText(value, fontBold, 9.2, 165);
    page.drawText(wrapped[0], {
      x: xPos + 82,
      y: yPos,
      size: 9.2,
      font: fontBold,
      color: cDark,
    });
  };

  drawSimpleField(col1X, y - 19, "Empresa:", payload.empresaNombre);
  drawSimpleField(col1X, y - 35, "Sucursal:", payload.sucursalNombre);
  drawSimpleField(col1X, y - 51, "Caja:", payload.cajaNombre);

  drawSimpleField(col2X, y - 19, "Cajero(a):", payload.cajeroNombre);
  drawSimpleField(col2X, y - 35, "Fecha apertura:", payload.fechaInicio);
  drawSimpleField(col2X, y - 51, "Fecha cierre:", payload.fechaCierre);

  y = infoBoxBottom - 22;

  // =========================================================================
  // 2. RESULTADO DEL CIERRE DE CAJA (3 TARJETAS GRANDES Y CLARAS)
  // =========================================================================
  page.drawText("RESULTADO DEL CONTEO DE CAJA", {
    x: MARGIN_X,
    y,
    size: 10.5,
    font: fontBold,
    color: cDark,
  });
  y -= 10;

  const kpiGap = 12;
  const kpiW = (CONTENT_W - kpiGap * 2) / 3;
  const kpiH = 62;
  const kpiBottom = y - kpiH;

  // Tarjeta 1: Efectivo Esperado
  page.drawRectangle({
    x: MARGIN_X,
    y: kpiBottom,
    width: kpiW,
    height: kpiH,
    color: cCardBg,
    borderColor: cBorder,
    borderWidth: 1,
  });
  page.drawText("EFECTIVO ESPERADO", {
    x: MARGIN_X + 12,
    y: kpiBottom + 44,
    size: 8,
    font: fontBold,
    color: cSlate500,
  });
  page.drawText(fmt(payload.efectivoEsperado), {
    x: MARGIN_X + 12,
    y: kpiBottom + 23,
    size: 14.5,
    font: fontBold,
    color: cDark,
  });
  page.drawText("Lo que debía haber en caja", {
    x: MARGIN_X + 12,
    y: kpiBottom + 9,
    size: 7.8,
    font: fontNormal,
    color: cSlate500,
  });

  // Tarjeta 2: Efectivo Real
  const kpi2X = MARGIN_X + kpiW + kpiGap;
  page.drawRectangle({
    x: kpi2X,
    y: kpiBottom,
    width: kpiW,
    height: kpiH,
    color: cBlueSoft,
    borderColor: cBlueBorder,
    borderWidth: 1,
  });
  page.drawText("EFECTIVO EN CAJA FÍSICA", {
    x: kpi2X + 12,
    y: kpiBottom + 44,
    size: 8,
    font: fontBold,
    color: cBlue,
  });
  page.drawText(fmt(payload.efectivoReal), {
    x: kpi2X + 12,
    y: kpiBottom + 23,
    size: 14.5,
    font: fontBold,
    color: cDark,
  });
  page.drawText("Lo que contó el cajero", {
    x: kpi2X + 12,
    y: kpiBottom + 9,
    size: 7.8,
    font: fontNormal,
    color: cSlate500,
  });

  // Tarjeta 3: Diferencia
  const kpi3X = kpi2X + kpiW + kpiGap;
  page.drawRectangle({
    x: kpi3X,
    y: kpiBottom,
    width: kpiW,
    height: kpiH,
    color: statusSoft,
    borderColor: statusBorder,
    borderWidth: 1.2,
  });
  page.drawText("DIFERENCIA", {
    x: kpi3X + 12,
    y: kpiBottom + 44,
    size: 8,
    font: fontBold,
    color: statusColor,
  });
  const diffPrefix = diff > 0.01 ? "+" : "";
  page.drawText(`${diffPrefix}${fmt(diff)}`, {
    x: kpi3X + 12,
    y: kpiBottom + 23,
    size: 14.5,
    font: fontBold,
    color: statusColor,
  });
  const diffSubtext = isCuadrada
    ? "Caja cuadrada sin diferencias"
    : isFaltante
    ? "Dinero faltante en el cierre"
    : "Dinero sobrante en el cierre";
  page.drawText(diffSubtext, {
    x: kpi3X + 12,
    y: kpiBottom + 9,
    size: 7.8,
    font: fontBold,
    color: statusColor,
  });

  y = kpiBottom - 8;

  // Barra de Observación clara para el usuario final
  const obsH = 24;
  const obsBottom = y - obsH;
  page.drawRectangle({
    x: MARGIN_X,
    y: obsBottom,
    width: CONTENT_W,
    height: obsH,
    color: statusSoft,
    borderColor: statusBorder,
    borderWidth: 0.9,
  });
  const obsTexto = isCuadrada
    ? "Observación: El cierre de caja cuadró perfectamente. El dinero físico coincide con las cuentas del día."
    : isFaltante
    ? `Observación: Existe un faltante de ${fmt(
        Math.abs(diff),
      )}. Había ${fmt(payload.efectivoReal)} en físico y se esperaban ${fmt(
        payload.efectivoEsperado,
      )}.`
    : `Observación: Existe un sobrante de +${fmt(
        Math.abs(diff),
      )}. Había ${fmt(payload.efectivoReal)} en físico y se esperaban ${fmt(
        payload.efectivoEsperado,
      )}.`;
  page.drawText(sanitizePdfText(obsTexto), {
    x: MARGIN_X + 12,
    y: obsBottom + 8,
    size: 8.5,
    font: fontBold,
    color: statusColor,
  });

  y = obsBottom - 22;

  // =========================================================================
  // 3. RESUMEN DE CUENTAS (IGUAL A LA PANTALLA DEL POS)
  // =========================================================================
  page.drawText("RESUMEN DE CUENTAS DEL DÍA", {
    x: MARGIN_X,
    y,
    size: 10.5,
    font: fontBold,
    color: cDark,
  });
  y -= 10;

  const halfGap = 13.28;
  const halfW = (CONTENT_W - halfGap) / 2;

  const leftRows = [
    {
      label: "Base de caja (Apertura)",
      val: fmt(payload.totalApertura),
      color: cDark,
    },
    {
      label: "Ventas en Efectivo",
      val: `+ ${fmt(payload.totalVentasEfectivo)}`,
      color: cGreen,
    },
    {
      label: `Entradas de dinero (${payload.entradasDetalle.length})`,
      val: `+ ${fmt(payload.totalIngresos)}`,
      color: cGreen,
    },
    {
      label: `Salidas / Gastos (${payload.salidasDetalle.length})`,
      val: `- ${fmt(payload.totalSalidas)}`,
      color: cRed,
    },
  ];

  const rightRows = payload.ventasPorMetodo.map((item) => ({
    label: `En ${sanitizePdfText(item.metodo_pago)}`,
    val: fmt(item.monto),
    color: Number(item.monto) > 0 ? cDark : cSlate400,
  }));

  const maxRows = Math.max(leftRows.length, rightRows.length, 1);
  const rowH = 21;
  const headH = 23;
  const footH = 25;
  const boxH = headH + maxRows * rowH + footH;

  ensureSpace(boxH + 15);
  const boxTop = y;
  const boxBottom = boxTop - boxH;

  // Cuadro Izquierdo: Dinero en Caja
  page.drawRectangle({
    x: MARGIN_X,
    y: boxBottom,
    width: halfW,
    height: boxH,
    color: cWhite,
    borderColor: cBorder,
    borderWidth: 1,
  });
  page.drawRectangle({
    x: MARGIN_X,
    y: boxTop - headH,
    width: halfW,
    height: headH,
    color: cDark,
  });
  page.drawText("DINERO EN CAJA (EFECTIVO)", {
    x: MARGIN_X + 12,
    y: boxTop - 15,
    size: 8.5,
    font: fontBold,
    color: cWhite,
  });

  for (let i = 0; i < maxRows; i++) {
    const rTop = boxTop - headH - i * rowH;
    const rBottom = rTop - rowH;
    if (i % 2 === 1) {
      page.drawRectangle({
        x: MARGIN_X + 0.5,
        y: rBottom,
        width: halfW - 1,
        height: rowH,
        color: cRowAlt,
      });
    }
    page.drawLine({
      start: { x: MARGIN_X, y: rBottom },
      end: { x: MARGIN_X + halfW, y: rBottom },
      thickness: 0.5,
      color: cBorder,
    });
    const item = leftRows[i];
    if (item) {
      page.drawText(sanitizePdfText(item.label), {
        x: MARGIN_X + 12,
        y: rBottom + 6.5,
        size: 8.8,
        font: fontNormal,
        color: cSlate700,
      });
      drawRightText(
        page,
        item.val,
        MARGIN_X + halfW - 12,
        rBottom + 6.5,
        9,
        fontBold,
        item.color,
      );
    }
  }

  page.drawRectangle({
    x: MARGIN_X + 0.5,
    y: boxBottom + 0.5,
    width: halfW - 1,
    height: footH - 0.5,
    color: cCardBg,
  });
  page.drawText("Efectivo esperado en caja:", {
    x: MARGIN_X + 12,
    y: boxBottom + 8.5,
    size: 8.8,
    font: fontBold,
    color: cDark,
  });
  drawRightText(
    page,
    fmt(payload.efectivoEsperado),
    MARGIN_X + halfW - 12,
    boxBottom + 8.5,
    9.8,
    fontBold,
    cDark,
  );

  // Cuadro Derecho: Ventas Totales por Método de Pago
  const rightX = MARGIN_X + halfW + halfGap;
  page.drawRectangle({
    x: rightX,
    y: boxBottom,
    width: halfW,
    height: boxH,
    color: cWhite,
    borderColor: cBorder,
    borderWidth: 1,
  });
  page.drawRectangle({
    x: rightX,
    y: boxTop - headH,
    width: halfW,
    height: headH,
    color: cDark,
  });
  page.drawText("VENTAS POR MÉTODO DE PAGO", {
    x: rightX + 12,
    y: boxTop - 15,
    size: 8.5,
    font: fontBold,
    color: cWhite,
  });

  for (let i = 0; i < maxRows; i++) {
    const rTop = boxTop - headH - i * rowH;
    const rBottom = rTop - rowH;
    if (i % 2 === 1) {
      page.drawRectangle({
        x: rightX + 0.5,
        y: rBottom,
        width: halfW - 1,
        height: rowH,
        color: cRowAlt,
      });
    }
    page.drawLine({
      start: { x: rightX, y: rBottom },
      end: { x: rightX + halfW, y: rBottom },
      thickness: 0.5,
      color: cBorder,
    });
    const item = rightRows[i];
    if (item) {
      page.drawText(sanitizePdfText(item.label), {
        x: rightX + 12,
        y: rBottom + 6.5,
        size: 8.8,
        font: fontNormal,
        color: cSlate700,
      });
      drawRightText(
        page,
        item.val,
        rightX + halfW - 12,
        rBottom + 6.5,
        9,
        fontBold,
        item.color,
      );
    }
  }

  page.drawRectangle({
    x: rightX + 0.5,
    y: boxBottom + 0.5,
    width: halfW - 1,
    height: footH - 0.5,
    color: cBlueSoft,
  });
  page.drawText("Total Ventas del Día:", {
    x: rightX + 12,
    y: boxBottom + 8.5,
    size: 8.8,
    font: fontBold,
    color: cBlue,
  });
  drawRightText(
    page,
    fmt(payload.totalVentasGeneral),
    rightX + halfW - 12,
    boxBottom + 8.5,
    9.8,
    fontBold,
    cBlue,
  );

  y = boxBottom - 24;

  // =========================================================================
  // 4. DETALLE Y OBSERVACIONES DE ENTRADAS Y SALIDAS DE CAJA
  // =========================================================================
  const todosMovsManuales = [
    ...payload.entradasDetalle.map((m) => ({ ...m, tipo: "ENTRADA" })),
    ...payload.salidasDetalle.map((m) => ({ ...m, tipo: "SALIDA" })),
  ];

  ensureSpace(70);
  page.drawText(
    `DETALLE DE ENTRADAS Y SALIDAS / GASTOS DEL TURNO (${todosMovsManuales.length})`,
    {
      x: MARGIN_X,
      y,
      size: 10.5,
      font: fontBold,
      color: cDark,
    },
  );
  y -= 10;

  const drawMovsHeader = () => {
    const hH = 22;
    const hBottom = y - hH;
    page.drawRectangle({
      x: MARGIN_X,
      y: hBottom,
      width: CONTENT_W,
      height: hH,
      color: cDark,
    });
    page.drawText("TIPO", {
      x: MARGIN_X + 12,
      y: hBottom + 7,
      size: 8,
      font: fontBold,
      color: cWhite,
    });
    page.drawText("FECHA Y HORA", {
      x: MARGIN_X + 86,
      y: hBottom + 7,
      size: 8,
      font: fontBold,
      color: cWhite,
    });
    page.drawText("OBSERVACIÓN / MOTIVO", {
      x: MARGIN_X + 185,
      y: hBottom + 7,
      size: 8,
      font: fontBold,
      color: cWhite,
    });
    drawRightText(
      page,
      "MONTO",
      MARGIN_X + CONTENT_W - 12,
      hBottom + 7,
      8,
      fontBold,
      cWhite,
    );
    y = hBottom;
  };

  drawMovsHeader();

  if (todosMovsManuales.length === 0) {
    const emptyH = 28;
    const emptyBottom = y - emptyH;
    page.drawRectangle({
      x: MARGIN_X,
      y: emptyBottom,
      width: CONTENT_W,
      height: emptyH,
      color: cCardBg,
      borderColor: cBorder,
      borderWidth: 0.8,
    });
    page.drawText(
      "No se registraron entradas ni salidas de dinero adicionales en este turno.",
      {
        x: MARGIN_X + 12,
        y: emptyBottom + 10,
        size: 8.6,
        font: fontNormal,
        color: cSlate500,
      },
    );
    y = emptyBottom - 16;
  } else {
    for (let idx = 0; idx < todosMovsManuales.length; idx++) {
      const mov = todosMovsManuales[idx];
      const descLines = wrapText(
        mov.descripcion || "Sin observación",
        fontNormal,
        8.5,
        235,
      );
      const lineH = 11.5;
      const dynRowH = Math.max(23, descLines.length * lineH + 10);

      if (y - dynRowH < BOTTOM_LIMIT) {
        addPage(false);
        drawMovsHeader();
      }

      const rBottom = y - dynRowH;
      page.drawRectangle({
        x: MARGIN_X,
        y: rBottom,
        width: CONTENT_W,
        height: dynRowH,
        color: idx % 2 === 1 ? cRowAlt : cWhite,
        borderColor: cBorder,
        borderWidth: 0.5,
      });

      const textBaseY = y - 14.5;

      const isEntrada = mov.tipo === "ENTRADA";
      const badgeBg = isEntrada ? cGreenSoft : cRedSoft;
      const badgeFg = isEntrada ? cGreen : cRed;
      const badgeBrd = isEntrada ? cGreenBorder : cRedBorder;

      page.drawRectangle({
        x: MARGIN_X + 12,
        y: textBaseY - 3,
        width: 58,
        height: 14,
        color: badgeBg,
        borderColor: badgeBrd,
        borderWidth: 0.8,
      });
      page.drawText(mov.tipo, {
        x: MARGIN_X + 19,
        y: textBaseY + 1,
        size: 7.2,
        font: fontBold,
        color: badgeFg,
      });

      page.drawText(
        mov.fecha_movimiento ? formatDateTime(mov.fecha_movimiento) : "-",
        {
          x: MARGIN_X + 86,
          y: textBaseY,
          size: 8.2,
          font: fontNormal,
          color: cSlate700,
        },
      );

      descLines.forEach((line, lineIdx) => {
        page.drawText(line, {
          x: MARGIN_X + 185,
          y: textBaseY - lineIdx * lineH,
          size: 8.5,
          font: fontNormal,
          color: cDark,
        });
      });

      const sign = isEntrada ? "+" : "-";
      drawRightText(
        page,
        `${sign} ${fmt(mov.monto)}`,
        MARGIN_X + CONTENT_W - 12,
        textBaseY,
        8.8,
        fontBold,
        badgeFg,
      );

      y = rBottom;
    }

    // Fila de Totales de Entradas y Salidas
    ensureSpace(28);
    const sumH = 24;
    const sumBottom = y - sumH;
    page.drawRectangle({
      x: MARGIN_X,
      y: sumBottom,
      width: CONTENT_W,
      height: sumH,
      color: cCardBg,
      borderColor: cBorder,
      borderWidth: 0.9,
    });
    page.drawText(
      `Total Entradas: + ${fmt(payload.totalIngresos)}     |     Total Salidas / Gastos: - ${fmt(
        payload.totalSalidas,
      )}`,
      {
        x: MARGIN_X + 12,
        y: sumBottom + 8,
        size: 8.8,
        font: fontBold,
        color: cDark,
      },
    );
  }

  // Pie de página en todas las hojas
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];
    p.drawLine({
      start: { x: MARGIN_X, y: 42 },
      end: { x: PAGE_W - MARGIN_X, y: 42 },
      thickness: 0.8,
      color: cBorder,
    });
    p.drawText("SoftCreate POS  -  Reporte de Cierre de Caja", {
      x: MARGIN_X,
      y: 26,
      size: 8,
      font: fontBold,
      color: cSlate500,
    });
    drawRightText(
      p,
      `Página ${i + 1} de ${totalPages}`,
      PAGE_W - MARGIN_X,
      26,
      8,
      fontBold,
      cSlate500,
    );
  }

  return await pdfDoc.save();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));

    if (body?.record && body?.old_record) {
      const nuevoEstado = Number(body.record.estado);
      const viejoEstado = Number(body.old_record.estado);
      if (nuevoEstado !== 1 || viejoEstado === 1) {
        return new Response(
          JSON.stringify({
            skipped: true,
            message: "El estado no cambió de 0 a 1.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }
    }

    const idCierreCaja =
      body?.id_cierre_caja ?? body?.id ?? body?.record?.id ?? null;

    if (!idCierreCaja) {
      return new Response(
        JSON.stringify({ error: "Falta el parámetro id_cierre_caja." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // 1. Obtener registro de cierrecaja junto con caja y sucursal
    const { data: cierre, error: errCierre } = await supabase
      .from("cierrecaja")
      .select("*, caja(*, sucursales(*))")
      .eq("id", idCierreCaja)
      .maybeSingle();

    if (errCierre) throw errCierre;

    const idUsuario = cierre?.id_usuario ?? body?.id_usuario ?? null;
    const idEmpresaFromSucursal =
      cierre?.caja?.sucursales?.id_empresa ?? body?.id_empresa ?? null;

    // 2. Obtener datos del cajero
    let usuario: any = null;
    if (idUsuario) {
      const { data: uData } = await supabase
        .from("usuarios")
        .select("*, roles(*)")
        .eq("id", idUsuario)
        .maybeSingle();
      usuario = uData;
    }

    // 3. Obtener datos de la empresa
    let empresa: any = null;
    if (idEmpresaFromSucursal) {
      const { data: empData } = await supabase
        .from("empresa")
        .select("*")
        .eq("id", idEmpresaFromSucursal)
        .maybeSingle();
      empresa = empData;
    }
    if (!empresa && idUsuario) {
      const { data: empRpc } = await supabase
        .rpc("mostrarempresaxiduser", { _id_usuario: idUsuario })
        .maybeSingle();
      empresa = empRpc;
    }

    const correoDestino =
      empresa?.correo?.trim() ||
      body?.correo_empresa?.trim() ||
      usuario?.correo?.trim();

    if (!correoDestino) {
      return new Response(
        JSON.stringify({
          message:
            "La empresa no tiene un correo electrónico registrado para enviar el reporte de cierre.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // 4. Consultar todos los movimientos de este cierre directamente en movimientos_caja
    // (Nota: No dependemos de los RPCs que filtran por estado=0 porque al cerrar turno estado ya es 1)
    const [resMovsCajaAll, resMetodosEmpresa] = await Promise.all([
      supabase
        .from("movimientos_caja")
        .select("*")
        .eq("id_cierre_caja", idCierreCaja)
        .order("id", { ascending: true }),
      empresa?.id
        ? supabase
            .from("metodos_pago")
            .select("id, nombre")
            .eq("id_empresa", empresa.id)
            .order("id", { ascending: true })
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const movsCajaAll = Array.isArray(resMovsCajaAll.data)
      ? resMovsCajaAll.data
      : [];
    const metodosEmpresa = Array.isArray(resMetodosEmpresa.data)
      ? resMetodosEmpresa.data
      : [];

    const metodosMapById = new Map<number, string>();
    for (const m of metodosEmpresa) {
      if (m?.id && m?.nombre) {
        metodosMapById.set(Number(m.id), String(m.nombre).trim());
      }
    }

    // Calcular Base de Apertura, Entradas y Salidas directamente de movimientos_caja
    const totalApertura = movsCajaAll
      .filter((m: any) => m?.tipo_movimiento === "apertura")
      .reduce((acc: number, m: any) => acc + (Number(m?.monto) || 0), 0);

    const entradasDetalle = movsCajaAll
      .filter((m: any) => m?.tipo_movimiento === "ingreso")
      .map((m: any) => ({
        fecha_movimiento: m.fecha_movimiento || "",
        descripcion: m.descripcion || "Entrada de dinero",
        monto: Number(m.monto) || 0,
      }));

    const salidasDetalle = movsCajaAll
      .filter((m: any) => m?.tipo_movimiento === "salida")
      .map((m: any) => ({
        fecha_movimiento: m.fecha_movimiento || "",
        descripcion: m.descripcion || "Salida / Gasto de caja",
        monto: Number(m.monto) || 0,
      }));

    const totalIngresos = entradasDetalle.reduce(
      (acc, item) => acc + (Number(item.monto) || 0),
      0,
    );

    const totalSalidas = salidasDetalle.reduce(
      (acc, item) => acc + (Number(item.monto) || 0),
      0,
    );

    // Calcular Ventas por Método de Pago usando únicamente los métodos registrados en la empresa
    const ventasMap = new Map<string, number>();
    for (const m of metodosEmpresa) {
      const nombre = String(m?.nombre || "").trim();
      if (nombre && nombre !== "-") {
        ventasMap.set(nombre, 0);
      }
    }

    for (const m of movsCajaAll) {
      if (m?.tipo_movimiento === "venta") {
        let nombreMetodo =
          metodosMapById.get(Number(m?.id_metodo_pago)) || "";
        if (!nombreMetodo && m?.descripcion) {
          const match = String(m.descripcion).match(/Pago de venta con ([^|]+)/i);
          if (match?.[1]) nombreMetodo = match[1].trim();
        }
        if (!nombreMetodo) nombreMetodo = "Otro";
        const monto = Number(m?.monto) || 0;
        ventasMap.set(nombreMetodo, (ventasMap.get(nombreMetodo) || 0) + monto);
      }
    }

    const ventasPorMetodo = Array.from(ventasMap.entries()).map(
      ([metodo_pago, monto]) => ({
        metodo_pago,
        monto,
      }),
    );

    const totalVentasGeneral = ventasPorMetodo.reduce(
      (acc, item) => acc + (Number(item.monto) || 0),
      0,
    );

    const totalVentasEfectivo = ventasPorMetodo
      .filter((item) => item.metodo_pago.toLowerCase() === "efectivo")
      .reduce((acc, item) => acc + (Number(item.monto) || 0), 0);

    const efectivoCalculadoSistema =
      totalApertura + totalVentasEfectivo + totalIngresos - totalSalidas;

    const efectivoEsperado = Number(
      cierre?.total_efectivo_calculado ??
        body?.total_efectivo_calculado ??
        efectivoCalculadoSistema,
    );
    const efectivoReal = Number(
      cierre?.total_efectivo_real ?? body?.total_efectivo_real ?? 0,
    );
    const diferencia = Number(
      cierre?.diferencia_efectivo ??
        body?.diferencia_efectivo ??
        efectivoReal - efectivoEsperado,
    );

    // 5. Subir logo de SoftCreate al bucket público 'imagenes' para el correo HTML
    let logoPublicUrl = "";
    try {
      const logoBytes = base64ToUint8Array(SOFTCREATE_LOGO_PNG_BASE64);
      const storagePath = "branding/softcreate-logo.png";
      await supabase.storage.from("imagenes").upload(storagePath, logoBytes, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });
      const { data: pubData } = supabase.storage
        .from("imagenes")
        .getPublicUrl(storagePath);
      if (pubData?.publicUrl) {
        logoPublicUrl = pubData.publicUrl;
      }
    } catch (_e) {
      // Fallback silencioso
    }

    const simboloMoneda = empresa?.simbolo_moneda || "$";
    const currency = empresa?.currency || "COP";
    const empresaNombre = empresa?.nombre || "Empresa";
    const sucursalNombre =
      cierre?.caja?.sucursales?.nombre || "Sucursal Principal";
    const cajaNombre = cierre?.caja?.descripcion || "Caja Principal";
    const cajeroNombre = usuario?.nombres || "Cajero";

    const fechaInicioStr = formatDateTime(cierre?.fechainicio);
    const fechaCierreStr = formatDateTime(
      cierre?.fechacierre || body?.fechacierre || new Date().toISOString(),
    );

    // 6. Construir el PDF sencillo y claro
    const pdfBytes = await buildCierreCajaPdf({
      empresaNombre,
      simboloMoneda,
      currency,
      sucursalNombre,
      cajaNombre,
      cajeroNombre,
      fechaInicio: fechaInicioStr,
      fechaCierre: fechaCierreStr,
      totalApertura,
      totalVentasEfectivo,
      totalIngresos,
      totalSalidas,
      efectivoEsperado,
      efectivoReal,
      diferencia,
      totalVentasGeneral,
      ventasPorMetodo,
      entradasDetalle,
      salidasDetalle,
    });

    const base64Pdf = uint8ArrayToBase64(pdfBytes);

    // 7. Construir el correo HTML con los datos exactos
    const fmt = (v: unknown) => formatMoney(v, simboloMoneda, currency);
    const isCuadrada = Math.abs(diferencia) < 0.01;
    const isFaltante = diferencia < -0.01;

    const badgeBgHtml = isCuadrada
      ? "#dcfce7"
      : isFaltante
      ? "#fee2e2"
      : "#fef3c7";
    const badgeColorHtml = isCuadrada
      ? "#15803d"
      : isFaltante
      ? "#b91c1c"
      : "#b45309";
    const badgeTextHtml = isCuadrada
      ? "CAJA CUADRADA SIN DIFERENCIAS"
      : isFaltante
      ? `FALTANTE EN CAJA: ${fmt(diferencia)}`
      : `SOBRANTE EN CAJA: +${fmt(diferencia)}`;

    const metodosRowsHtml = ventasPorMetodo
      .map(
        (m) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 14px;">En ${m.metodo_pago}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 600; font-size: 14px;">${fmt(m.monto)}</td>
        </tr>`,
      )
      .join("");

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
        
        <div style="height: 6px; background-color: #0f172a;"></div>

        <!-- Cabecera -->
        <div style="padding: 26px 28px 18px; border-bottom: 1px solid #e2e8f0; text-align: center; background-color: #ffffff;">
          ${
            logoPublicUrl
              ? `<img src="${logoPublicUrl}" width="180" alt="SoftCreate" style="display: block; margin: 0 auto 12px; max-width: 180px; height: auto;" />`
              : `<div style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">SoftCreate</div>`
          }
          <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px;">
            Reporte de Cierre de Caja
          </div>
          <span style="display: inline-block; background-color: ${badgeBgHtml}; color: ${badgeColorHtml}; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 999px;">
            ${badgeTextHtml}
          </span>
        </div>

        <!-- Cuerpo -->
        <div style="padding: 24px 28px;">
          <p style="color: #1e293b; font-size: 15px; margin-top: 0; line-height: 1.5;">
            Hola, <strong>${empresaNombre}</strong>. Se ha cerrado el turno de <strong>${cajaNombre}</strong> (${sucursalNombre}) a cargo de <strong>${cajeroNombre}</strong>.
          </p>

          <!-- Resumen de Conteo -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; margin: 20px 0;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 10px;">
              Resultado del Conteo de Caja
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #475569; font-size: 14px;">Efectivo esperado en caja:</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-size: 15px; font-weight: 700;">${fmt(efectivoEsperado)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #475569; font-size: 14px;">Efectivo en caja física (contado):</td>
                <td style="padding: 6px 0; text-align: right; color: #1d4ed8; font-size: 15px; font-weight: 700;">${fmt(efectivoReal)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0 2px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; font-weight: 700;">Diferencia:</td>
                <td style="padding: 10px 0 2px; border-top: 1px solid #e2e8f0; text-align: right; color: ${badgeColorHtml}; font-size: 16px; font-weight: 800;">
                  ${diferencia > 0 ? "+" : ""}${fmt(diferencia)}
                </td>
              </tr>
            </table>
          </div>

          <!-- Dinero en Caja -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">
              Cuentas del Efectivo en Caja
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 14px;">Base de caja (Apertura)</td>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 600; font-size: 14px;">${fmt(totalApertura)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 14px;">Ventas en Efectivo</td>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #15803d; font-weight: 600; font-size: 14px;">+ ${fmt(totalVentasEfectivo)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 14px;">Entradas de dinero (${entradasDetalle.length})</td>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #15803d; font-weight: 600; font-size: 14px;">+ ${fmt(totalIngresos)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 14px;">Salidas / Gastos (${salidasDetalle.length})</td>
                <td style="padding: 7px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #b91c1c; font-weight: 600; font-size: 14px;">- ${fmt(totalSalidas)}</td>
              </tr>
            </table>
          </div>

          <!-- Ventas por Método de Pago -->
          <div style="margin-bottom: 18px;">
            <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">
              Ventas por Método de Pago
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              ${metodosRowsHtml}
              <tr>
                <td style="padding: 10px 0 4px; color: #0f172a; font-weight: 700; font-size: 14px;">Total Ventas del Turno</td>
                <td style="padding: 10px 0 4px; text-align: right; color: #2563eb; font-weight: 800; font-size: 15px;">${fmt(totalVentasGeneral)}</td>
              </tr>
            </table>
          </div>

          <p style="color: #475569; font-size: 13px; line-height: 1.5; background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 10px 14px; border-radius: 4px; margin: 16px 0 0;">
            Adjunto encontrarás el reporte en <strong>PDF</strong> con el resumen y las observaciones de las entradas y salidas del día.
          </p>
        </div>

        <!-- Pie -->
        <div style="background-color: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
            <strong>SoftCreate POS</strong><br>
            Apertura: ${fechaInicioStr} &nbsp;|&nbsp; Cierre: ${fechaCierreStr}
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    const safeEmpresaFile = sanitizePdfText(empresaNombre)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_");
    const safeCajaFile = sanitizePdfText(cajaNombre)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_");

    const subjectStatus = isCuadrada
      ? "Caja Cuadrada"
      : isFaltante
      ? `Faltante ${fmt(diferencia)}`
      : `Sobrante +${fmt(diferencia)}`;

    const resEmail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SoftCreate POS <facturacion@softcreatepos.com>",
        to: correoDestino,
        subject: `Cierre de Caja (${cajaNombre}) - ${subjectStatus} | ${empresaNombre}`,
        html: htmlBody,
        attachments: [
          {
            filename: `Cierre_Caja_${safeCajaFile}_${safeEmpresaFile}.pdf`,
            content: base64Pdf,
          },
        ],
      }),
    });

    if (!resEmail.ok) {
      const errText = await resEmail.text();
      console.error(`Error enviando correo de cierre a ${correoDestino}:`, errText);
      return new Response(
        JSON.stringify({
          error: `Error enviando correo con Resend: ${errText}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: `Reporte PDF de cierre de caja enviado exitosamente a ${correoDestino}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err: any) {
    console.error("Error en enviar-cierre-caja:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Error interno" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
