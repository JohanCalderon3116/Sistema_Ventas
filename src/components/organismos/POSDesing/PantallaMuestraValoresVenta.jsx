import styled, { keyframes } from "styled-components";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useResumenVentaStore } from "../../../store/ResumenVentaStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
const ACCENT = {
  primary: "#0aca21",
  primaryDark: "#088f17",
  primarySoft: "rgba(10, 202, 33, 0.12)",
  borderSoft: "rgba(10, 202, 33, 0.25)",
};
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const subir = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const PantallaMuestraValoresVenta = () => {
  const { open, datos, cerrarResumenVenta } = useResumenVentaStore();
  const { dataempresa } = useEmpresaStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        cerrarResumenVenta();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, cerrarResumenVenta]);

  if (!open) return null;
  const fmt = (v) =>
    FormatearNumeroDinero(v || 0, dataempresa?.currency, dataempresa?.iso);

  return (
    <Overlay onClick={cerrarResumenVenta}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Contenido>
          <Cabecera>
            <IconoExito>
              <Icon icon="solar:check-circle-bold" />
            </IconoExito>
            <span>¡Cobro Exitoso!</span>
            <small>La operación se completó correctamente</small>
          </Cabecera>
          <SeccionResumen>
            <Fila>
              <span className="label">Total de la venta</span>
              <span className="valor-total">{fmt(datos?.total)}</span>
            </Fila>
            <SeparadorFino />
            <Fila>
              <span className="label">Total pagado (Recibido)</span>
              <span className="valor">{fmt(datos?.totalPagado)}</span>
            </Fila>
          </SeccionResumen>
          <Vuelto>
            <span>Vuelto a entregar</span>
            <strong>{fmt(datos?.vuelto)}</strong>
          </Vuelto>
          {datos?.restante > 0 && (
            <FilaRestante>
              <span>Restante por pagar:</span>
              <strong>{fmt(datos?.restante)}</strong>
            </FilaRestante>
          )}
          <Boton onClick={cerrarResumenVenta}>
            <Icon icon="solar:check-circle-bold" />
            Aceptar y Continuar
            <span>(Esc)</span>
          </Boton>
        </Contenido>
      </Container>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.18s ease both;
  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      animation: none !important;
    }
  }
`;

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 400px;
  max-width: 94vw;
  overflow: hidden;
  border-radius: 18px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgtotal || theme.bg2};
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff" ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)"};
  box-shadow: ${({ theme }) =>
    theme.body === "#fff"
      ? "0 24px 55px rgba(10, 202, 33, 0.15)"
      : "0 24px 55px rgba(0,0,0,0.65)"};
  animation: ${subir} 0.24s cubic-bezier(0.22, 1, 0.36, 1) both;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${ACCENT.primary};
  }
`;

const Contenido = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 26px 26px;
`;

const Cabecera = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  margin-bottom: 5px;
  span {
    font-size: 22px;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
  }
  small {
    font-size: 13px;
    opacity: 0.6;
  }
`;

const IconoExito = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: ${ACCENT.primarySoft};
  color: ${ACCENT.primary};
  font-size: 32px;
  margin-bottom: 4px;
`;

const SeccionResumen = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) =>
    theme.body === "#fff" ? "#f8f9fa" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff" ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.05)"};
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
`;

const Fila = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 15px;
    opacity: 0.7;
    font-weight: 500;
  }

  .valor {
    font-size: 17px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }

  .valor-total {
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    font-weight: 800;
    color: ${({ theme }) =>
      theme.body === "#fff" ? "#088f17" : ACCENT.primary};
  }
`;

const SeparadorFino = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) =>
    theme.body === "#fff" ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.06)"};
`;

const Vuelto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 110px;
  padding: 18px;
  box-sizing: border-box;
  border-radius: 14px;
  background: ${ACCENT.primarySoft};
  border: 1px dashed ${ACCENT.primary};

  span {
    font-size: 14px;
    font-weight: 700;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) =>
      theme.body === "#fff" ? ACCENT.primaryDark : ACCENT.primary};
  }

  strong {
    font-size: 42px;
    line-height: 1;
    font-weight: 850;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) =>
      theme.body === "#fff" ? ACCENT.primaryDark : ACCENT.primary};
  }
`;

const FilaRestante = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  span {
    font-size: 14px;
    color: #e04040;
    font-weight: 600;
  }
  strong {
    font-size: 16px;
    color: #e04040;
    font-weight: 800;
  }
`;

const Boton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
  margin-top: 6px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background-color: ${ACCENT.primary};
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;

  span {
    opacity: 0.7;
    font-size: 13px;
    font-weight: 500;
  }

  &:hover {
    background-color: ${ACCENT.primaryDark};
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${ACCENT.primaryDark};
    outline-offset: 2px;
  }
`;

export default PantallaMuestraValoresVenta;
