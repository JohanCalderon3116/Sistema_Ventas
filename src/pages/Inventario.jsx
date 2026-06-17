import styled from "styled-components";
import { CrudTemplate, useEmpresaStore, useProductosStore } from "..";
import { RegistrarInventario } from "../components/organismos/formularios/RegistrarInventario";
import { TablaInventarios } from "../components/organismos/tablas/TablaInventarios";
import { useQuery } from "@tanstack/react-query";
import { useMovStockStore } from "../store/MovStockStore";
import { BarLoader } from "react-spinners";
import { Toaster } from "sonner";

export const Inventario = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarMovStock } = useMovStockStore();
  const {
    ProductosItemSelect,
    buscador,
    buscarProductos,
    setBuscador,
    selectProductos,
  } = useProductosStore();
  const { data: dataProductos, error: errorBuscar } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({
        id_empresa: dataempresa?.id,
        buscador: buscador,
      }),
    enabled: !!dataempresa,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["mostrar movimientos de stock"],
    queryFn: () =>
      mostrarMovStock({
        id_empresa: dataempresa?.id,
        id_producto: ProductosItemSelect?.id,
      }),
    enabled: !!dataempresa,
  });
  return (
    <Container>
      <Toaster richColors></Toaster>
      <CrudTemplate
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
