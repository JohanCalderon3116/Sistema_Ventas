import styled, { keyframes } from "styled-components";
import { useEstadoConexion } from "../../hooks/useEstadoConexion";
import { Icon } from "@iconify/react";

const CONFIG_PILL = {
  estable: { texto: "Conexión estable", color: "#2ecc71", pulso: false },
  baja: { texto: "Conexión lenta", color: "#f39c12", pulso: true },
  muy_baja: { texto: "Conexión muy mala", color: "#e74c3c", pulso: true },
  sin_conexion: { texto: "Sin conexión", color: "#e74c3c", pulso: true },
};

export function IndicadorConexion() {
  const estado = useEstadoConexion();
  const { texto, color, pulso } = CONFIG_PILL[estado];

  return (
    <>
      {estado === "sin_conexion" && (
        <Banner>
          <Icon icon="mdi:wifi-off" width="18" />
          <span>Sin conexión a internet</span>
        </Banner>
      )}

      <Pill>
        <Punto $color={color} $pulso={pulso} />
        <span>{texto}</span>
      </Pill>
    </>
  );
}

const pulso = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
  70% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
`;

const parpadeo = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const Pill = styled.div`
  position: fixed;
  bottom: 14px;
  right: 14px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bg2};
  border: 1px solid rgba(161, 161, 161, 0.25);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0.85;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;

const Punto = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${({ $pulso }) => ($pulso ? pulso : "none")} 1.6s infinite;
`;

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  background: #e74c3c;
  animation: ${parpadeo} 1.6s ease-in-out infinite;
`;
