import { Icon } from "@iconify/react";
import styled, { keyframes } from "styled-components";
import { Btn1 } from "../components/moleculas/Btn1";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const AbrirCajaSerealizacion = ({ onClose }) => {
  return (
    <Container>
      <div className="sub-contenedor">
        <div className="icono-wrapper">
          <Icon
            icon="lucide:alert-circle"
            width="32"
            height="32"
            className="icono-alerta"
          />
        </div>
        <span className="eyebrow">Caja</span>
        <h2>Caja cerrada</h2>
        <p>
          Para ver y gestionar las serializaciones de comprobantes, primero
          debes abrir la caja.
        </p>
        <Btn1
          titulo="De acuerdo"
          bgcolor="#18181B"
          color="255,255,255"
          width="100%"
          funcion={onClose}
        />
      </div>
    </Container>
  );
};
const Container = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(9, 9, 11, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  overflow: hidden;
  .sub-contenedor {
    position: relative;
    width: 400px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    padding: 36px 32px 28px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    overflow: hidden;
    box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.45);
    animation: ${popIn} 0.28s cubic-bezier(0.16, 1, 0.3, 1);

    .icono-wrapper {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.22);
      margin-bottom: 12px;
      z-index: 1;
    }
    .icono-alerta {
      color: #8b5cf6;
      z-index: 1;
    }
    .eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #8b5cf6;
      z-index: 1;
    }
    h2 {
      font-size: 22px;
      font-weight: 800;
      color: ${({ theme }) => theme.text};
      letter-spacing: -0.02em;
      margin: 2px 0 0;
      z-index: 1;
    }
    p {
      font-size: 14px;
      color: ${({ theme }) => theme.colorSubtitle};
      line-height: 1.55;
      margin: 6px 0 18px;
      max-width: 300px;
      z-index: 1;
    }
    button,
    a {
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 0;
      transition: all 0.2s ease-out;
      z-index: 1;
      &:hover {
        transform: translateY(-1px);
      }
      &:active {
        transform: translateY(0);
      }
    }
  }
`;
