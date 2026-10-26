import { css, keyframes } from "styled-components";

/* =========================================================
   ENTRADA DESDE ABAJO
========================================================= */

export const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* =========================================================
   ENTRADA CON ESCALA
========================================================= */

export const fadeScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/* =========================================================
   DESDE IZQUIERDA
========================================================= */

export const slideRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-24px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* =========================================================
   DESDE DERECHA
========================================================= */

export const slideLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(24px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* =========================================================
   MODAL / FORMULARIO
========================================================= */

export const modalOpen = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

/* =========================================================
   PULSO
========================================================= */

export const pulseSoft = keyframes`
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
  }
`;

/* =========================================================
   FLOTAR
========================================================= */

export const floating = keyframes`
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-7px) rotate(2deg);
  }
`;

/* =========================================================
   GIRAR SUAVE
========================================================= */

export const rotateSoft = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

/* =========================================================
   INTERACCIÓN GENERAL
========================================================= */

export const interactiveTransition = css`
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease,
    opacity 0.25s ease;
`;

/* =========================================================
   MOVIMIENTO REDUCIDO
========================================================= */

export const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    &,
    & *,
    & *::before,
    & *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;