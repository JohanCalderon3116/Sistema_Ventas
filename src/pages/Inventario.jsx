import styled from "styled-components";
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
  const { setBuscador, selectProductos } = useProductosStore();
  const { data: dataProductos } = useBuscarProductosQueryStack();
  const { data } = useMostrarMovimientosStockQueryStack();

  useEffect(() => {
    setBuscador("");
    return () => setBuscador("");
  }, []);

  return (
    <Container>
      <div className="contenido">
        <Toaster richColors position="top-center" />
        <CrudTemplate
          stateBtnAdd={true}
          stateBuscador={true}
          Table={TablaInventarios}
          title="Inventarios"
          Formularioregistro={RegistrarInventario}
          data={data || []}
          tipoBuscador="list"
          dataBuscadorList={dataProductos}
          selectBuscadorList={selectProductos}
          setBuscadorList={setBuscador}
          bgcolorBtnAdd="#18181B"
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  .contenido {
    position: relative;
    z-index: 5;
    padding-bottom: 40px;
  }
  button[title="Nuevo"],
  button[aria-label="Nuevo"] {
    background: #18181b !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    transition: all 0.2s ease-out !important;
    &:hover {
      background: #27272a !important;
      border-color: rgba(139, 92, 246, 0.35) !important;
      transform: translateY(-1px);
    }
  }
`;
