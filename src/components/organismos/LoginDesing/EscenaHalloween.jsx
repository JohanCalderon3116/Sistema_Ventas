import styled, { keyframes } from "styled-components";

export const Sombrero = () => null;
export const CardWeb = () => null;
export const Telarana = () => null;
export const AranaSvg = () => null;
export const MurcielagoSvg = () => null;
export const CementerioSvg = () => null;

const floatParticle = keyframes`
  0% {
    transform: translateY(0px) translateX(0px) scale(0.9);
    opacity: 0.25;
  }
  50% {
    transform: translateY(-28px) translateX(10px) scale(1.25);
    opacity: 0.75;
  }
  100% {
    transform: translateY(0px) translateX(0px) scale(0.9);
    opacity: 0.25;
  }
`;

const PARTICLES = [
  { left: "10%", top: "20%", size: 3.5, delay: "0s", dur: "7s" },
  { left: "22%", top: "72%", size: 3, delay: "1.2s", dur: "9s" },
  { left: "35%", top: "15%", size: 2.5, delay: "2.5s", dur: "8s" },
  { left: "48%", top: "82%", size: 3.5, delay: "0.7s", dur: "10s" },
  { left: "63%", top: "24%", size: 3, delay: "1.8s", dur: "7.5s" },
  { left: "78%", top: "68%", size: 3.5, delay: "3.1s", dur: "9.5s" },
  { left: "88%", top: "30%", size: 2.5, delay: "0.4s", dur: "8.5s" },
  { left: "15%", top: "50%", size: 3, delay: "2.1s", dur: "11s" },
  { left: "84%", top: "84%", size: 3, delay: "1.5s", dur: "8s" },
  { left: "54%", top: "12%", size: 2.5, delay: "2.9s", dur: "9s" },
];

export const EscenaHalloween = () => {
  return (
    <FondoArquitectonico aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <VioletDot
          key={i}
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </FondoArquitectonico>
  );
};

const FondoArquitectonico = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(
        to right,
        ${({ theme }) =>
            theme?.bgtotal === "#121216"
              ? "rgba(255, 255, 255, 0.025)"
              : "rgba(18, 18, 22, 0.03)"}
          1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        ${({ theme }) =>
            theme?.bgtotal === "#121216"
              ? "rgba(255, 255, 255, 0.025)"
              : "rgba(18, 18, 22, 0.03)"}
          1px,
        transparent 1px
      );
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 35%, transparent 100%);
    -webkit-mask-image: radial-gradient(
      ellipse 80% 70% at 50% 45%,
      #000 35%,
      transparent 100%
    );
  }
`;

const VioletDot = styled.span`
  position: absolute;
  border-radius: 50%;
  background: #8b5cf6;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.55);
  animation: ${floatParticle} 8s ease-in-out infinite;
`;
