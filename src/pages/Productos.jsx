import {
  ProductosTemplate,
  useMostrarProductosQueryStack,
  useBuscarProductosQueryStack,
  useProductosStore,
} from "../index";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";
import { useMostrarSucursalesXEmpresaStack } from "../tanstack/SucursalesStack";
import { useMostrarCategoriasQueryStack } from "../tanstack/CategoriasStack";
import { useEffect } from "react";

export const Productos = () => {
  const theme = useTheme();
  const { setBuscador } = useProductosStore();
  const { isLoading: isLoadingMostrarProductos } =
    useMostrarProductosQueryStack();
  useBuscarProductosQueryStack();
  const { isLoading: isLoadingMostrarSucursales } =
    useMostrarSucursalesXEmpresaStack();
  const { isLoading: isLoadingMostrarCategorias } =
    useMostrarCategoriasQueryStack();
  useEffect(() => {
    setBuscador("");
    return () => setBuscador("");
  }, []);
  const isLoading =
    isLoadingMostrarCategorias ||
    isLoadingMostrarProductos ||
    isLoadingMostrarSucursales;
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
  return <ProductosTemplate></ProductosTemplate>;
};

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
