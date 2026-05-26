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

export const Productos = () => {
  const { mostrarCategorias } = useCategroriasStore();
  const { mostrarSucursales } = useSucursalesStore();
  const { mostrarProductos, buscarProductos, buscador, setRefetch } =
    useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarAlmacenXsucursal } = useAlmacenesStore();
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
  // const { isLoading: isLoadingMostrarAlmacenes } = useQuery({
  //   queryKey: ["mostrar almacen x sucursal", dataempresa?.id],
  //   queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
  //   enabled: !!dataempresa,
  //   refetchOnWindowFocus: false,
  // });

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
  // isLoadingMostrarAlmacenes;
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
  return <ProductosTemplate></ProductosTemplate>;
};
