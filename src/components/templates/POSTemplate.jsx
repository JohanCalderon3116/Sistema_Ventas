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
  useMostrarSerealizacionesVentasQueryStack,
  useStockStore,
  useVentasStore,
} from "../../index";
import { toast, Toaster } from "sonner";
import { SelectAlmacen } from "../organismos/POSDesing/SelectAlmacen";
import { useBuscarproductosQueryStack } from "../../tanstack/ProductosStack";
import { useMostrarAlmacenesXSucursalQueryStack } from "../../tanstack/AlmacenesStack";
import { useMostrarStockAlmacenesyProductoQueryStack } from "../../tanstack/StockStack";
import { useMostrarMetodosDePagoQueryStack } from "../../tanstack/MetodosPagoStack";
import { BarLoader } from "react-spinners";
import { useMostrarImpresorasXCajaQueryStack } from "../../tanstack/ImpresorasStack";
export const POSTemplate = () => {
  const { statePantallaCobro } = useVentasStore();
  const { stateIngresoSalida, stateCierreCaja } = useCierreCajaStore();
  const { stateModal } = useStockStore();
  const {} = useBuscarproductosQueryStack();
  const { isLoading: isLoadingAlmacenXSucursal, error: errorAlmacenXSucursal } =
    useMostrarAlmacenesXSucursalQueryStack();
  const {
    isLoading: isLoadingStockPorProductoYAlmacen,
    error: errorStockPorProductoYAlmacen,
  } = useMostrarStockAlmacenesyProductoQueryStack();
  const { isLoading: isLoadingSerealizacionesVentas } =
    useMostrarSerealizacionesVentasQueryStack();
  const {} = useMostrarImpresorasXCajaQueryStack();
  // const isLoading =
  //   isLoadingAlmacenXSucursal ||
  //   isLoadingStockPorProductoYAlmacen ||
  //   isLoadingmetodosPago;
  // const error =
  //   errorAlmacenXSucursal || errorMetodosPago || errorStockPorProductoYAlmacen;
  // if (isLoading) {
  //   return <BarLoader></BarLoader>;
  // }
  // if (error) {
  //   toast.error("Error al mostrar");
  // }
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
