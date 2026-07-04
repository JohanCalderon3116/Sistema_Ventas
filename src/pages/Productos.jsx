import { useQuery } from "@tanstack/react-query";
import {
  Spinner1,
  useEmpresaStore,
  ProductosTemplate,
  useProductosStore,
  useSucursalesStore,
  useCategroriasStore,
  useAlmacenesStore,
} from "../index";
import Swal from "sweetalert2";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";

export const Productos = () => {
  const { mostrarCategorias } = useCategroriasStore();
  const { mostrarSucursales } = useSucursalesStore();
  const { mostrarProductos, buscarProductos, buscador, setRefetch } =
    useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarAlmacenXsucursal } = useAlmacenesStore();
  const theme = useTheme();
  const {
    isLoading: isLoadingMostrarProductos,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () =>
      mostrarProductos({ id_empresa: dataempresa?.id, refetchs: refetch }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const { isLoading: isLoadingMostrarSucursales } = useQuery({
    queryKey: ["mostrar sucursales", dataempresa?.id],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingMostrarCategorias } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
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
