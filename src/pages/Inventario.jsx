import styled, { useTheme } from "styled-components";
import {
  CrudTemplate,
  useBuscarProductosQueryStack,
  useProductosStore,
} from "..";
import { RegistrarInventario } from "../components/organismos/formularios/RegistrarInventario";
import { TablaInventarios } from "../components/organismos/tablas/TablaInventarios";
import { BeatLoader } from "react-spinners";
import { Toaster } from "sonner";
import { useMostrarMovimientosStockQueryStack } from "../tanstack/MovimientosStock";

export const Inventario = () => {
  const theme = useTheme();
  const {
    setBuscador,
    selectProductos,
  } = useProductosStore();
  const { data: dataProductos } =
    useBuscarProductosQueryStack();
  const { data, isLoading } = useMostrarMovimientosStockQueryStack();
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      <CrudTemplate
        stateBtnAdd={true}
        stateBuscador={true}
        Table={TablaInventarios}
        title={"Inventarios"}
        Formularioregistro={RegistrarInventario}
        data={data || []}
        tipoBuscador={"list"}
        dataBuscadorList={dataProductos}
        selectBuscadorList={selectProductos}
        setBuscadorList={setBuscador}
      ></CrudTemplate>
    </Container>
  );
};

const Container = styled.div``;
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
