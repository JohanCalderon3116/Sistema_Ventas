import styled from "styled-components";

export function AccionTabla({ funcion, icono, color, fontSize }) {
  return (
    <Container onClick={funcion} $color={color} $fontSize={fontSize}>
      {icono}
    </Container>
  );
}

const Container = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize || "17px"};
  background: color-mix(in srgb, ${(props) => props.$color || "#71717A"} 10%, transparent);
  border: 1px solid color-mix(in srgb, ${(props) => props.$color || "#71717A"} 22%, transparent);
  cursor: pointer;
  transition: all 0.18s ease-out;

  &:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, ${(props) => props.$color || "#71717A"} 18%, transparent);
  }

  &:active {
    transform: scale(0.95);
  }
`;
