import styled, { keyframes } from "styled-components";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useResumenVentaStore } from "../../../store/ResumenVentaStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";

export const PantallaMuestraValoresVenta = () => {
  const { open, datos, cerrarResumenVenta } = useResumenVentaStore();
  const { dataempresa } = useEmpresaStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && cerrarResumenVenta();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const fmt = (v) =>
    FormatearNumeroDinero(v, dataempresa?.currency, dataempresa?.iso);

  return (
    <Overlay onClick={cerrarResumenVenta}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Cabecera>
          <Icon icon="noto:money-bag" width="40" height="40" />
          <span>Venta registrada</span>
        </Cabecera>

        <Fila>
          <span>Total</span>
          <strong>{fmt(datos.total)}</strong>
        </Fila>

        <Vuelto>
          <span>Vuelto</span>
          <strong>{fmt(datos.vuelto)}</strong>
        </Vuelto>

        <Fila className="suave">
          <span>Restante</span>
          <strong>{fmt(datos.restante)}</strong>
        </Fila>

        <Boton onClick={cerrarResumenVenta}>Cerrar (Esc)</Boton>
      </Container>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const subir = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease both;

  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      animation: none !important;
    }
  }
`;

const Container = styled.div`
  box-sizing: border-box;
  width: 380px;
  max-width: 92vw;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bg2};
  border: 1px solid rgba(139, 92, 246, 0.25);
  box-shadow: ${({ theme }) =>
    theme.body === "#fff"
      ? "0px 10px 30px rgba(0, 0, 0, 0.12)"
      : "0px 10px 30px rgba(0, 0, 0, 0.5)"};
  animation: ${subir} 0.25s ease both;
`;

const Cabecera = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  span {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
  }
`;

const Fila = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;

  strong {
    font-variant-numeric: tabular-nums;
  }

  &.suave {
    opacity: 0.55;
  }
`;

const Vuelto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.12);

  span {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    opacity: 0.7;
  }

  strong {
    font-size: 38px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => (theme.body === "#fff" ? "#7c3aed" : "#a78bfa")};
  }
`;

const Boton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background-color: #8b5cf6;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    background-color: #7c3aed;
  }
  &:active {
    transform: scale(0.98);
  }
`;
