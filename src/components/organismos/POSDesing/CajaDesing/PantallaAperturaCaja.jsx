import styled from "styled-components";
import { InputText2 } from "../../formularios/InputText2";
import { Btn1 } from "../../../moleculas/Btn1";
import { useState } from "react";
import { useUsuariosStore } from "../../../../store/UsuariosStore";
import { useCajasStore } from "../../../../store/CajaStore";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { useMetodosPagoStore } from "../../../../store/MetodosPagoStore";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { useAsignacionCajaSucursalesStore } from "../../../../store/AsignacionCajaSucursales";
import { useMostrarSucursalesAsignadsQueryStack } from "../../../../tanstack/AsignacionesSucursal";
import { CardListCajas } from "./CardListCajas";
import { Device } from "../../../../styles/breakpoints";
import { useMostrarCierreCajaPorEmpresaQueryStack } from "../../../../tanstack/CierreCajaStack";

export const PantallaAperturaCaja = () => {
  const fechaActual = useFormattedDate();
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const queryClient = useQueryClient();
  const { datausuarios } = useUsuariosStore();
  const { sucursalesItemSelectAsignadas, datSucursalesAsignadas } =
    useAsignacionCajaSucursalesStore();
  const { aperturarCaja } = useCierreCajaStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { insertarMovcaja } = useMovCajaStore();
  const { data: dataCierreCajaEmpresa } =
    useMostrarCierreCajaPorEmpresaQueryStack();
  const { setCajaSelelctItem } = useCajasStore();
  const { setCierreCjaItemSelect } = useCierreCajaStore();

  return (
    <Container>
      <Toaster richColors></Toaster>
      <ContainerCajas>
        <span className="title">
          Seleccione una caja para poder aperturarla.
        </span>
        {datSucursalesAsignadas?.map((item, index) => {
          let state = Boolean(false);
          let aperturaActiva = null;
          if (Array.isArray(dataCierreCajaEmpresa)) {
            aperturaActiva = dataCierreCajaEmpresa.find(
              (a) => a.id_caja === item.id,
            );
            state = Boolean(aperturaActiva);
          }
          return (
            <CardListCajas
              key={index}
              item={item}
              state={state}
              subtitle={
                state ? `${aperturaActiva?.rol}-${aperturaActiva?.usuario}` : 0
              }
              funcion={() => {
                setCajaSelelctItem(item);
                if (state) {
                  setCierreCjaItemSelect(aperturaActiva);
                }
              }}
              sucursal={item?.sucursales?.nombre}
              title={item?.caja?.descripcion}
              bgcolor={state ? "#f34a4" : "#58cc02"}
            ></CardListCajas>
          );
        })}
      </ContainerCajas>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 30px;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  align-items: center;
  justify-content: center;
  display: flex;
  .area1 {
    display: flex;
    gap: 12px;
    flex-direction: column;
    .title {
      font-size: 19px;
      font-weight: bold;
    }
    .contentbtn {
      display: flex;
      gap: 12px;
    }
  }
`;
const ContainerCajas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 10px;
  @media ${Device.tablet} {
    width: 550px;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
  }
`;
