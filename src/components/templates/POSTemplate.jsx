import styled from "styled-components";
import { Device } from "../../styles/breakpoints";
import {
  AreaDetalleventaPos,
  AreaTecladoPos,
  FooterPos,
  HeaderPos,
  MenuFlotante,
  PantallaCierreCaja,
  PantallaCobro,
  PantallaIngresoSalidaDinero,
  SelectAlmacen,
  useBuscarProductosCodigoQueryStack,
  useCierreCajaStore,
  useMostrarSerealizacionesVentasQueryStack,
  useMovimientosCreditosStore,
  useStockStore,
  useVentasStore,
} from "../../index";
import { Toaster } from "sonner";
import { useMostrarAlmacenesXSucursalQueryStack } from "../../tanstack/AlmacenesStack";
import { useMostrarStockAlmacenesyProductoQueryStack } from "../../tanstack/StockStack";
import { useMostrarImpresorasXCajaQueryStack } from "../../tanstack/ImpresorasStack";
import { PantallaAbonoCredito } from "../organismos/POSDesing/CajaDesing/PantallaAbonoCredito";
import { PantallaMuestraValoresVenta } from "../organismos/POSDesing/PantallaMuestraValoresVenta";

export const POSTemplate = () => {
  const { statePantallaCobro } = useVentasStore();
  const { stateIngresoSalida, stateCierreCaja } = useCierreCajaStore();
  const { stateIngresoCredito } = useMovimientosCreditosStore();
  const { stateModal } = useStockStore();
  useBuscarProductosCodigoQueryStack();
  useMostrarAlmacenesXSucursalQueryStack();
  useMostrarStockAlmacenesyProductoQueryStack();
  useMostrarSerealizacionesVentasQueryStack();
  useMostrarImpresorasXCajaQueryStack();
  return (
    <>
      <FondoCorporativoPOS aria-hidden="true" />
      <Container>
        {statePantallaCobro && <PantallaCobro />}
        <PantallaMuestraValoresVenta />
        <HeaderPos />
        <Main>
          <Toaster richColors position="top-center" />
          <AreaDetalleventaPos />
          <AreaTecladoPos />
          {stateModal && <SelectAlmacen />}
        </Main>
        <FooterPos />
        <MenuFlotante />
        {stateIngresoSalida && <PantallaIngresoSalidaDinero />}
        {stateIngresoCredito && <PantallaAbonoCredito />}
        {stateCierreCaja && <PantallaCierreCaja />}
      </Container>
    </>
  );
};

const FondoCorporativoPOS = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Container = styled.div`
  box-sizing: border-box;
  height: 100vh;
  padding: 50px 10px 12px 10px;
  display: grid;
  gap: 10px;
  grid-template-areas:
    "header"
    "main";
  grid-template-rows: 220px 1fr;
  position: relative;
  z-index: 1;
  @media ${Device.desktop} {
    grid-template-areas:
      "header header"
      "main main"
      "footer footer";
    grid-template-rows: 140px 1fr 60px;
    grid-template-columns: 1fr;
    padding-bottom: 12px;
  }
`;

const Main = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
  gap: 10px;
  @media ${Device.desktop} {
    flex-direction: row;
  }
`;
