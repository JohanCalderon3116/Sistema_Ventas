import styled from "styled-components";
import { useCajasStore } from "../../../../store/CajaStore";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { Toaster } from "sonner";
import { useAsignacionCajaSucursalesStore } from "../../../../store/AsignacionCajaSucursales";
import { CardListCajas } from "./CardListCajas";
import { Device } from "../../../../styles/breakpoints";
import { useMostrarCierreCajaPorEmpresaQueryStack } from "../../../../tanstack/CierreCajaStack";

export const PantallaAperturaCaja = () => {
  const { datSucursalesAsignadas } =
    useAsignacionCajaSucursalesStore();
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
              (a) => a.id_caja === item.caja.id, 
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
              bgcolor={state ? "#d51d1d" : "#58cc02"}
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
