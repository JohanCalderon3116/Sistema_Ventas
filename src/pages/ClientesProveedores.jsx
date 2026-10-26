
import styled, { keyframes, useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";
import {
  useBuscarClientesProveedoresLocationQueryStack,
  useMostrarClientesProveedoresQueryStack,
} from "../tanstack/ClientesProveedoresStack";
import { ClientesProveedoresTemplate } from "../components/templates/ClientesProveedoresTemplate";
const aparecer = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const pulse = keyframes`
  0%,100% { opacity: .08; }
  50% { opacity: .18; }
`;

export const ClientesProveedores = () => {
  const theme = useTheme();
  const { isLoading } = useMostrarClientesProveedoresQueryStack();
  useBuscarClientesProveedoresLocationQueryStack();

  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando...</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }

  return (
    <Container>
      <Decoraciones />
      <ClientesProveedoresTemplate></ClientesProveedoresTemplate>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${({ theme }) => theme.bgtotal};
  overflow: hidden;
  animation: ${aparecer} 0.3s ease both;
`;

const Decoraciones = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    opacity: 0.07;
    background:
      repeating-radial-gradient(
        circle at center,
        transparent 0 18px,
        currentColor 19px 20px,
        transparent 21px 34px
      ),
      repeating-conic-gradient(
        from 0deg,
        transparent 0 14deg,
        currentColor 15px 16px,
        transparent 17px 30px
      );
    mask-image: radial-gradient(circle at center, #000 0 55%, transparent 78%);
    -webkit-mask-image: radial-gradient(
      circle at center,
      #000 0 55%,
      transparent 78%
    );
    color: ${({ theme }) => theme.color2};
    animation: ${pulse} 7s ease-in-out infinite;
  }
  &::before {
    top: -110px;
    left: -90px;
  }
  &::after {
    right: -100px;
    bottom: -100px;
    animation-delay: 2s;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
  color: ${({ theme }) => theme.text};
`;
