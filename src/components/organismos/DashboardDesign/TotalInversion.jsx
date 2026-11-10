import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Icon } from "@iconify/react";
import { CardTotales } from "./CardTotales";
import {
  useMostrarTotalInventarioQueryStack,
  useValidarPermisosOpertivos,
} from "../../..";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import { BarLoader } from "react-spinners";

export const TotalInversion = () => {
  const __theme = useTheme();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, data } = useMostrarTotalInventarioQueryStack();
  const [visible, setVisible] = useState(false);
  const { validarPermiso } = useValidarPermisosOpertivos();

  const desbloquear = () => {
    const permitido = validarPermiso("Ver invertido");
    if (!permitido) return;
    setVisible(true);
  };

  if (isLoading) {
    return <BarLoader color={__theme?.text} />;
  }

  return (
    <Contenedor>
      <Tarjeta $oculta={!visible}>
        <CardTotales
          title="Tot. Invertido"
          icon="mdi:dollar"
          value={FormatearNumeroDinero(
            data?.total_invertido ?? 0,
            dataempresa?.currency,
            dataempresa?.iso,
          )}
          warning={
            data?.hay_productos_sin_inventario
              ? `Puede no ser exacto: ${data.productos_sin_inventario} producto(s) no manejan inventario`
              : null
          }
        />
      </Tarjeta>
      {!visible && (
        <Candado type="button" onClick={desbloquear}>
          <Icon icon="lucide:lock" width="24" height="24" />
          <span>Ver dinero invertido</span>
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
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease-out,
    color 0.2s ease-out;
  svg {
    color: ${({ theme }) => theme.text};
  }

  &:hover {
    transform: translateY(-1px);
    color: ${({ theme }) => theme.text};
  }
`;
