import { useQuery } from "@tanstack/react-query";
import {
  ProductosTemplate,
  useMostrarProductosQueryStack,
  useBuscarProductosQueryStack,
} from "../index";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";
import { useMostrarSucursalesXEmpresaStack } from "../tanstack/SucursalesStack";
import { useMostrarCategoriasQueryStack } from "../tanstack/CategoriasStack";

export const Productos = () => {
  const theme = useTheme();
  const {
    isLoading: isLoadingMostrarProductos,
    error,
    refetch,
  } = useMostrarProductosQueryStack();
  useBuscarProductosQueryStack();
  const { isLoading: isLoadingMostrarSucursales } =
    useMostrarSucursalesXEmpresaStack();
  const { isLoading: isLoadingMostrarCategorias } =
    useMostrarCategoriasQueryStack();
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
