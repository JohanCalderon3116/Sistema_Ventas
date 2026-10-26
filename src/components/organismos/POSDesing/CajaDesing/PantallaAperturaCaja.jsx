import styled from "styled-components";
import { useCajasStore } from "../../../../store/CajaStore";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { Toaster } from "sonner";
import { useAsignacionCajaSucursalesStore } from "../../../../store/AsignacionCajaSucursales";
import { CardListCajas } from "./CardListCajas";
import { Device } from "../../../../styles/breakpoints";
import { useMostrarCierreCajaPorEmpresaQueryStack } from "../../../../tanstack/CierreCajaStack";

export const PantallaAperturaCaja = () => {
  const { datSucursalesAsignadas } = useAsignacionCajaSucursalesStore();
  const { data: dataCierreCajaEmpresa } =
    useMostrarCierreCajaPorEmpresaQueryStack();
  const { setCajaSelelctItem } = useCajasStore();
  const { setCierreCjaItemSelect } = useCierreCajaStore();

  return (
    <Container>
      <Toaster richColors />
      <ContainerCajas>
        <span className="title">
          Seleccione una caja para poder aperturarla.
        </span>
        {datSucursalesAsignadas?.map((item, index) => {
          let state = false;
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
              bgcolor={state ? "#a94d4d" : "#539b5b"}
            />
          );
        })}
      </ContainerCajas>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 30px 20px 25px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(184, 102, 39, 0.08);
    pointer-events: none;
  }
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
  width: min(700px, 94%);
  margin: 10px auto;
  box-sizing: border-box;
  .title {
    font-weight: 600;
    font-size: 18px;
    text-align: center;
    opacity: 0.82;
    margin-bottom: 5px;
  }
  @media ${Device.tablet} {
    width: 550px;
  }
  @media (max-width: 600px) {
    width: 94%;
    margin: 10px auto;
  }
`;
