import { useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  FormatearNumeroDineroSinIsoYCurrency,
  useMostrarGanaciasXEmpresaQueryStack,
  useValidarPermisosOpertivos,
} from "../../..";
import { BarLoader } from "react-spinners";

export const Ganacias = () => {
  const [visible, setVisible] = useState(false);
  const { validarPermiso } = useValidarPermisosOpertivos();
  const { totalGanancias, porcentajeCambioGanancias } = useDetalleVentasStore();
  const { isLoading } = useMostrarGanaciasXEmpresaQueryStack();

  const desbloquear = () => {
    const permitido = validarPermiso("Ver ganancias");
    if (!permitido) return;
    setVisible(true);
  };

  if (isLoading) {
    return <BarLoader></BarLoader>;
  }

  return (
    <Contenedor>
      <Tarjeta $oculta={!visible}>
        <CardTotales
          title="Ganancias"
          icon="mdi:dollar"
          value={FormatearNumeroDineroSinIsoYCurrency(totalGanancias)}
          porcentage={porcentajeCambioGanancias}
        ></CardTotales>
      </Tarjeta>

      {!visible && (
        <Candado type="button" onClick={desbloquear}>
          <Icon icon="mdi:lock-outline" width="28" height="28" />
          <span>Ver ganancias</span>
        </Candado>
      )}
    </Contenedor>
  );
};

const Contenedor = styled.div`
  position: relative;
`;

const Tarjeta = styled.div`
  transition: filter 0.25s ease;
  filter: ${({ $oculta }) => ($oculta ? "blur(10px)" : "none")};
  pointer-events: ${({ $oculta }) => ($oculta ? "none" : "auto")};
  user-select: ${({ $oculta }) => ($oculta ? "none" : "auto")};
`;

const Candado = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  cursor: pointer;
`;
