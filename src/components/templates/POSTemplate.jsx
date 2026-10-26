import styled from "styled-components";
import { Device } from "../../styles/breakpoints";
import { blur_in } from "../../styles/Keyframes";
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
    <Container>
      {statePantallaCobro && <PantallaCobro></PantallaCobro>}
      <PantallaMuestraValoresVenta></PantallaMuestraValoresVenta>
      <HeaderPos></HeaderPos>
      <Main>
        <Toaster richColors />
        <AreaDetalleventaPos></AreaDetalleventaPos>
        <AreaTecladoPos></AreaTecladoPos>
        {stateModal && <SelectAlmacen></SelectAlmacen>}
      </Main>
      <FooterPos></FooterPos>
      <MenuFlotante></MenuFlotante>
      {stateIngresoSalida && (
        <PantallaIngresoSalidaDinero></PantallaIngresoSalidaDinero>
      )}
      {stateIngresoCredito && <PantallaAbonoCredito></PantallaAbonoCredito>}
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
