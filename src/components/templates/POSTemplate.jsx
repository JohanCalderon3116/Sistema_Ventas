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
  useCartVentasStore,
  useCierreCajaStore,
} from "../../index";
import { Toaster } from "sonner";
export const POSTemplate = () => {
  const { statePantallaCobro } = useCartVentasStore();
  const { stateIngresoSalida } = useCierreCajaStore();
  return (
    <Container>
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
      <PantallaCierreCaja></PantallaCierreCaja>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  display: grid;
  padding-top: 50px;
  gap: 10px;
  grid-template:
    "header" 220px
    "main" auto;
  animation: ${blur_in} 0.4s linear both;
  @media ${Device.desktop} {
    grid-template:
      "header header" 140px
      "main main"
      "footer footer" 60px;
  }
`;

const Main = styled.div`
  grid-area: main;
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
