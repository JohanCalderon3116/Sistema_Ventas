import styled from "styled-components";
import { Device } from "../../styles/breakpoints";
import { v } from "../../styles/variables";
import { blur_in } from "../../styles/Keyframes";
import {
  AreaDetalleventaPos,
  AreaTecladoPos,
  Btn1,
  FooterPos,
  HeaderPos,
  InputText2,
  MenuFlotante,
  PantallaCierreCaja,
  PantallaCobro,
  PantallaIngresoSalidaDinero,
  Reloj,
  useCierreCajaStore,
  useStockStore,
  useVentasStore,
} from "../../index";
import { Toaster } from "sonner";
import { SelectAlmacen } from "../organismos/POSDesing/SelectAlmacen";
export const POSTemplate = () => {
  const { statePantallaCobro } = useVentasStore();
  const { stateIngresoSalida, stateCierreCaja } = useCierreCajaStore();
  const { stateModal } = useStockStore();
  return (
    <Container>
      {stateModal && <SelectAlmacen></SelectAlmacen>}
      {statePantallaCobro && <PantallaCobro></PantallaCobro>}

      <HeaderPos></HeaderPos>
      <Main>
        <Toaster richColors position="top-center" />
        <AreaDetalleventaPos></AreaDetalleventaPos>
        <AreaTecladoPos></AreaTecladoPos>
      </Main>
      <FooterPos></FooterPos>
      <MenuFlotante></MenuFlotante>
      {stateIngresoSalida && (
        <PantallaIngresoSalidaDinero></PantallaIngresoSalidaDinero>
      )}
      {stateCierreCaja && <PantallaCierreCaja></PantallaCierreCaja>}
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 60px);
  padding: 10px;
  padding-top: 50px;
  display: grid;
  gap: 10px;
  grid-template:
    "header" 220px
    "main" auto;

  animation: ${blur_in} 0.5s linear both;
  @media ${Device.desktop} {
    grid-template:
      "header header" 140px
      "main main"
      "footer footer" 60px;
  }
`;

const Main = styled.div`
  grid-area: main;
  /* background-color: rgba(228, 20, 20, 0.5); */
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
  gap: 10px;

  @media ${Device.desktop} {
    flex-direction: row;
  }
`;
