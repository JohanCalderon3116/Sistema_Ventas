import styled, { useTheme } from "styled-components";
import {
  CrudTemplate,
  useBuscarProductosQueryStack,
  useProductosStore,
} from "..";
import { RegistrarInventario } from "../components/organismos/formularios/RegistrarInventario";
import { TablaInventarios } from "../components/organismos/tablas/TablaInventarios";
import { Toaster } from "sonner";
import { useMostrarMovimientosStockQueryStack } from "../tanstack/MovimientosStock";
import { useEffect } from "react";

export const Inventario = () => {
  const theme = useTheme();
  const { setBuscador, selectProductos } = useProductosStore();
  const { data: dataProductos } = useBuscarProductosQueryStack();
  const { data } = useMostrarMovimientosStockQueryStack();
  useEffect(() => {
    setBuscador("");
    return () => setBuscador("");
  }, []);
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
