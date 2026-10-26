import { createGlobalStyle, keyframes } from "styled-components";

const floatParticlesA = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0.45;
  }
  50% {
    transform: translate3d(-14px, -22px, 0);
    opacity: 0.75;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.45;
  }
`;

const floatParticlesB = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0.35;
  }
  50% {
    transform: translate3d(16px, -18px, 0);
    opacity: 0.65;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.35;
  }
`;

export const GlobalStyles = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
    }

    html, body, #root {
        min-height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    html {
        background-color: ${(props) => props.theme.bgtotal};
    }

    body {
        font-family: "Poppins", sans-serif;
        background-color: ${(props) => props.theme.bgtotal};
        color: ${(props) => props.theme.text};
        transition: background-color 0.25s ease, color 0.25s ease;
        position: relative;
        overflow-x: hidden;
    }

    /* Puntitos morados flotantes ultra sutiles y premium */
    body::before,
    body::after {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9998;
    }

    body::before {
        background-image:
            radial-gradient(circle at 12% 18%, rgba(139, 92, 246, 0.42) 0, rgba(139, 92, 246, 0.42) 2px, transparent 3px),
            radial-gradient(circle at 28% 76%, rgba(167, 139, 250, 0.35) 0, rgba(167, 139, 250, 0.35) 1.5px, transparent 2.5px),
            radial-gradient(circle at 64% 14%, rgba(139, 92, 246, 0.38) 0, rgba(139, 92, 246, 0.38) 2px, transparent 3px),
            radial-gradient(circle at 86% 42%, rgba(167, 139, 250, 0.32) 0, rgba(167, 139, 250, 0.32) 2px, transparent 3px),
            radial-gradient(circle at 48% 88%, rgba(139, 92, 246, 0.36) 0, rgba(139, 92, 246, 0.36) 1.5px, transparent 2.5px),
            radial-gradient(circle at 92% 82%, rgba(139, 92, 246, 0.38) 0, rgba(139, 92, 246, 0.38) 2px, transparent 3px);
        animation: ${floatParticlesA} 11s ease-in-out infinite;
    }

    body::after {
        background-image:
            radial-gradient(circle at 18% 52%, rgba(167, 139, 250, 0.32) 0, rgba(167, 139, 250, 0.32) 1.5px, transparent 2.5px),
            radial-gradient(circle at 42% 28%, rgba(139, 92, 246, 0.36) 0, rgba(139, 92, 246, 0.36) 2px, transparent 3px),
            radial-gradient(circle at 74% 66%, rgba(139, 92, 246, 0.38) 0, rgba(139, 92, 246, 0.38) 2px, transparent 3px),
            radial-gradient(circle at 82% 19%, rgba(167, 139, 250, 0.30) 0, rgba(167, 139, 250, 0.30) 1.5px, transparent 2.5px),
            radial-gradient(circle at 33% 92%, rgba(139, 92, 246, 0.32) 0, rgba(139, 92, 246, 0.32) 2px, transparent 3px);
        animation: ${floatParticlesB} 15s ease-in-out infinite;
    }

    body::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background: transparent;
    }

    body::-webkit-scrollbar-thumb {
        background: ${(props) => props.theme.colorScroll};
        border-radius: 9999px;
    }

    .swal2-popup {
        font-family: "Poppins", sans-serif !important;
        border-radius: 16px !important;
        border: 1px solid ${(props) => props.theme.color2} !important;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35) !important;
    }
`;
