import styled, { useTheme } from "styled-components";
import { Icono } from "../../index";

function normalizeCssColor(rawColor) {
  if (!rawColor || typeof rawColor !== "string") return null;
  const trimmed = rawColor.trim();
  if (!trimmed) return null;
  if (trimmed.includes(",") && !trimmed.startsWith("rgb") && !trimmed.startsWith("hsl")) {
    return `rgb(${trimmed})`;
  }
  return trimmed;
}

function isDarkBgColor(bg) {
  if (!bg) return false;
  const c = bg.toLowerCase().trim();
  const darkSet = [
    "#18181b",
    "#121216",
    "#121215",
    "#111114",
    "#09090b",
    "#0a0a0c",
    "#000",
    "#000000",
    "#202020",
    "#242424",
    "#2b2b2b",
    "#27272a",
    "#dc2626",
    "#ef4444",
    "#e04040",
    "#10b981",
    "#059669",
    "#1da939",
    "#0aca21",
    "#7c3aed",
    "#8b5cf6",
    "#9a5425",
    "#b85c18",
  ];
  return darkSet.includes(c);
}

function isMonochromePrimaryBg(bg) {
  if (!bg) return false;
  const c = bg.toLowerCase().trim();
  return [
    "#18181b",
    "#121216",
    "#121215",
    "#111114",
    "#09090b",
    "#202020",
    "#242424",
    "#2b2b2b",
    "#9a5425",
    "#b85c18",
  ].includes(c);
}

export function Btn1({
  funcion,
  titulo,
  bgcolor,
  icono,
  url,
  color,
  disabled,
  width,
  border,
  height,
  decorador,
  imagen,
}) {
  const theme = useTheme();
  const isDarkTheme =
    theme?.text === "#FFFFFF" ||
    theme?.bgtotal === "#050505" ||
    theme?.bgtotal === "#000000" ||
    theme?.bgtotal === "#121216" ||
    theme?.bgtotal === "#09090B" ||
    theme?.bgtotal === "#101010";

  const rawBg = normalizeCssColor(bgcolor);
  const rawText = normalizeCssColor(color);
  const normalizedTitle =
    typeof titulo === "string" ? titulo.trim().toLowerCase() : "";

  const isSemanticSuccessTitle = [
    "guardar",
    "guardar cambios",
    "confirmar",
    "aceptar",
    "cobrar",
    "aplicar",
    "registrar",
  ].includes(normalizedTitle);

  const isSemanticDangerTitle = [
    "eliminar",
    "eliminar venta",
    "sí, cerrar sesión",
    "cerrar sesión",
  ].includes(normalizedTitle);

  // Resolver fondo y color de texto con contraste garantizado en Modo Claro y Modo Oscuro
  let resolvedBg = rawBg;
  let resolvedText = rawText;
  let resolvedBorder = isDarkTheme
    ? "rgba(255, 255, 255, 0.10)"
    : "rgba(17, 17, 17, 0.12)";

  if (isSemanticSuccessTitle) {
    resolvedBg = "#10B981";
    resolvedText = "#FFFFFF";
    resolvedBorder = "transparent";
  } else if (isSemanticDangerTitle) {
    resolvedBg = "#EF4444";
    resolvedText = "#FFFFFF";
    resolvedBorder = "transparent";
  } else if (!resolvedBg) {
    // Botón secundario/superficie por defecto (ej. métodos de pago en POS)
    resolvedBg = isDarkTheme ? "#0D0D0D" : "#F7F7F8";
    resolvedText = isDarkTheme ? "#FFFFFF" : "#111111";
    resolvedBorder = isDarkTheme
      ? "rgba(255, 255, 255, 0.10)"
      : "rgba(17, 17, 17, 0.12)";
  } else if (isMonochromePrimaryBg(resolvedBg)) {
    // Botón primario monocromático: en modo oscuro es blanco con texto negro, en modo claro es negro con texto blanco
    if (isDarkTheme) {
      resolvedBg = "#FFFFFF";
      resolvedText = "#050505";
      resolvedBorder = "rgba(255, 255, 255, 0.9)";
    } else {
      resolvedBg = "#111111";
      resolvedText = "#FFFFFF";
      resolvedBorder = "#111111";
    }
  } else if (
    resolvedBg.toLowerCase() === "#ffffff" ||
    resolvedBg.toLowerCase() === "#fff"
  ) {
    if (isDarkTheme) {
      resolvedBg = "#0D0D0D";
      resolvedText = "#FFFFFF";
      resolvedBorder = "rgba(255, 255, 255, 0.10)";
    } else {
      resolvedBg = "#F7F7F8";
      resolvedText = "#111111";
      resolvedBorder = "rgba(17, 17, 17, 0.14)";
    }
  } else if (isDarkBgColor(resolvedBg)) {
    resolvedText = "#FFFFFF";
    resolvedBorder = "transparent";
  } else if (!resolvedText) {
    resolvedText = "#111111";
  }

  return (
    <Container
      $width={width}
      disabled={disabled}
      $color={resolvedText}
      type="submit"
      $bgcolor={resolvedBg}
      onClick={funcion}
      $border={border}
      $borderColor={resolvedBorder}
      $decorador={decorador}
      $height={height}
    >
      <section className="content">
        {icono && <Icono $color={resolvedText}>{icono}</Icono>}
        {imagen && (
          <ContentImage>
            <img src={imagen} alt={titulo || "icon"} />
          </ContentImage>
        )}
        {titulo && (
          <span className="btn">
            {url ? (
              <a href={url} target="_blank" rel="noreferrer">
                {titulo}
              </a>
            ) : (
              <span className="btn-text">{titulo}</span>
            )}
          </span>
        )}
      </section>
    </Container>
  );
}

const Container = styled.button`
  position: relative;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  display: inline-flex;
  font-size: 14px;
  letter-spacing: -0.01em;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: ${(props) => props.$bgcolor};
  border: 1px solid ${(props) => props.$borderColor || "rgba(128, 128, 128, 0.18)"};
  cursor: pointer;
  transition:
    transform 0.18s ease-out,
    box-shadow 0.18s ease-out,
    filter 0.18s ease-out,
    background-color 0.18s ease-out,
    border-color 0.18s ease-out;
  color: ${(props) => props.$color} !important;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$width || "auto"};
  height: ${(props) => props.$height || "auto"};
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

  .content {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.$color} !important;
  }

  .btn,
  .btn a,
  .btn .btn-text {
    color: ${(props) => props.$color} !important;
    text-decoration: none !important;
    line-height: 1.2;
    font-weight: 600;
  }

  svg {
    color: ${(props) => props.$color} !important;
  }

  &:hover:not([disabled]) {
    transform: translateY(-1px);
    filter: brightness(1.03);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  &:active:not([disabled]) {
    transform: translateY(0) scale(0.985);
  }

  &[disabled] {
    opacity: 0.42;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ContentImage = styled.section`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    object-fit: contain;
  }
`;
