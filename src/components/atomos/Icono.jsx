import styled from "styled-components";

function normalizeIconColor(rawColor) {
  if (!rawColor || typeof rawColor !== "string") return "inherit";
  const trimmed = rawColor.trim();
  if (trimmed.includes(",") && !trimmed.startsWith("rgb") && !trimmed.startsWith("hsl")) {
    return `rgb(${trimmed})`;
  }
  return trimmed;
}

export const Icono = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  color: ${(props) => normalizeIconColor(props.$color)};
`;
