import styled from "styled-components";
import { Btn1 } from "../../moleculas/Btn1";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import {
  useDetalleVentasStore,
  useEmpresaStore,
  useVentasStore,
} from "../../../index";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import { useValidarPermisosOpertivos } from "../../../hooks/UseValidarPermisosOpertivos";

export const TotalPos = () => {
  const { setStateMetodosPago } = useVentasStore();
  const { total } = useDetalleVentasStore();
  const { dataempresa } = useEmpresaStore();
  const { validarPermiso } = useValidarPermisosOpertivos();

  const validarPermisosCobrar = () => {
    const hasPermission = validarPermiso("Cobrar venta");
    if (!hasPermission) return;
    setStateMetodosPago();
  };

  return (
    <Container>
      <section className="imagen">
        <div className="icon-box">
          <Icon icon="lucide:receipt" width="26" height="26" />
        </div>
      </section>
      <section className="contentTotal">
        <section className="contentTituloTotal">
          <Btn1
            funcion={validarPermisosCobrar}
            bgcolor="#10B981"
            color="#FFFFFF"
            icono={<Icon icon="lucide:banknote" width="20" height="20" />}
            titulo="Cobrar"
          />
        </section>
        <span>
          {FormatearNumeroDinero(
            total,
            dataempresa?.currency,
            dataempresa?.iso,
          )}
        </span>
      </section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  border-radius: 14px;
  font-weight: 700;
  font-size: 36px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  padding: 12px 16px;
  color: ${({ theme }) => theme.text};
  position: relative;
  overflow: hidden;

  .imagen {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${({ theme }) => theme.bgAlpha};
      border: 1px solid ${({ theme }) => theme.color2};
      color: ${({ theme }) => theme.text};
    }
  }

  .contentTotal {
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .contentTituloTotal {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 6px;
      justify-content: flex-end;

      @media ${Device.desktop} {
        display: none;
      }
    }
  }
`;
