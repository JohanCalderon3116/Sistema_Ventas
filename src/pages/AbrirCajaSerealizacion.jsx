import { Icon } from "@iconify/react";
import styled, { keyframes } from "styled-components";
import { Btn1 } from "../components/moleculas/Btn1";

export const AbrirCajaSerealizacion = ({ onClose }) => {
  return (
    <Container>
      <div className="sub-contenedor">
        <div className="glow" />
        <div className="icono-wrapper">
          <span className="pulso" />
          <Icon
            icon="line-md:alert-circle"
            width="36"
            height="36"
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
          bgcolor="#5B21E0"
          width="100%"
          funcion={onClose}
        ></Btn1>
      </div>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
`;

const Container = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(6, 5, 12, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.25s ease;

  .sub-contenedor {
    position: relative;
    width: 400px;
    max-width: 85%;
    border-radius: 28px;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.04),
        rgba(255, 255, 255, 0) 40%
      ),
      ${({ theme }) => theme.bg2};
    padding: 44px 34px 32px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    overflow: hidden;
    box-shadow:
      0 30px 70px -15px rgba(0, 0, 0, 0.55),
      0 0 0 1px rgba(255, 255, 255, 0.07);
    animation: ${popIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    /* Franja decorativa superior con degradado de marca */
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #5b21e0, #9b6bff, #5b21e0);
      background-size: 200% 100%;
      animation: shimmer 3s linear infinite;
    }

    .glow {
      position: absolute;
      top: -60px;
      width: 220px;
      height: 220px;
      background: radial-gradient(
        circle,
        rgba(91, 33, 224, 0.35),
        transparent 70%
      );
      pointer-events: none;
      z-index: 0;
    }

    .icono-wrapper {
      position: relative;
      width: 74px;
      height: 74px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        145deg,
        rgba(155, 107, 255, 0.22),
        rgba(91, 33, 224, 0.08)
      );
      border: 1px solid rgba(155, 107, 255, 0.25);
      margin-bottom: 14px;
      z-index: 1;
    }

    .pulso {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid #9b6bff;
      animation: ${pulse} 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .icono-alerta {
      color: #a78bfa;
      z-index: 1;
    }

    .eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #9b6bff;
      z-index: 1;
    }

    h2 {
      font-size: 23px;
      font-weight: 800;
      color: ${({ theme }) => theme.text};
      letter-spacing: -0.4px;
      margin-top: 2px;
      z-index: 1;
    }

    p {
      font-size: 14.5px;
      color: ${({ theme }) =>
        theme.textLight || theme.colorSubtitle || "#9a9aa5"};
      line-height: 1.6;
      margin: 6px 0 16px;
      max-width: 300px;
      z-index: 1;
    }

    button,
    a {
      border-radius: 14px;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 0;
      box-shadow: 0 8px 20px -6px rgba(91, 33, 224, 0.6);
      transition:
        transform 0.15s ease,
        filter 0.15s ease,
        box-shadow 0.15s ease;
      z-index: 1;

      &:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
        box-shadow: 0 12px 24px -6px rgba(91, 33, 224, 0.7);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
