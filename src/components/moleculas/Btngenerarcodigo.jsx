import styled, { useTheme } from "styled-components";
import { Icono } from "../../index";

export function Btngenerarcodigo({
  funcion,
  titulo,
  bgcolor,
  icono,
  url,
  color,
  disabled,
  width,
}) {
  const theme = useTheme();
  const isDarkTheme =
    theme?.text === "#FFFFFF" ||
    theme?.bgtotal === "#050505" ||
    theme?.bgtotal === "#000000" ||
    theme?.bgtotal === "#121216" ||
    theme?.bgtotal === "#09090B" ||
    theme?.bgtotal === "#101010";

  const resolvedBg = bgcolor || (isDarkTheme ? "#1A1A1A" : "#E6E6EA");
  const resolvedText = color || (isDarkTheme ? "#FFFFFF" : "#111111");

  return (
    <Container
      $width={width}
      disabled={disabled}
      $color={resolvedText}
      $bgcolor={resolvedBg}
      onClick={funcion}
    >
      <section className="content">
        {icono && <Icono $color={resolvedText}>{icono}</Icono>}
        {titulo && (
          <span className="btn">
            {url ? (
              <a href={url} target="_blank" rel="noreferrer">
                {titulo}
              </a>
            ) : (
              <span>{titulo}</span>
            )}
          </span>
        )}
      </section>
    </Container>
  );
}

const Container = styled.div`
  font-weight: 600;
  display: inline-flex;
  font-size: 13px;
  padding: 7px 14px;
  border-radius: 8px;
  background-color: ${(props) => props.$bgcolor};
  border: 1px solid ${({ theme }) => theme.color2};
  cursor: pointer;
  transition: all 0.18s ease-out;
  color: ${(props) => props.$color} !important;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$width || "auto"};

  .content {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .btn,
  .btn a,
  .btn span {
    color: ${(props) => props.$color} !important;
    text-decoration: none !important;
  }

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
