import { useQuery } from "@tanstack/react-query";
import {
  Spinner1,
  useEmpresaStore,
  ProductosTemplate,
  useProductosStore,
  useSucursalesStore,
  useCategroriasStore,
} from "../index";

export const Productos = () => {
  const { mostrarCategorias } = useCategroriasStore();
  const { mostrarSucursales } = useSucursalesStore();
  const { mostrarProductos, buscarProductos, buscador, setRefetch } =
    useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error, refetch } = useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () =>
      mostrarProductos({ id_empresa: dataempresa?.id, refetchs: refetch }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const {} = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["mostrar sucursales", dataempresa?.id],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  if (error) {
    return <span>Error...</span>;
  }
  return <ProductosTemplate></ProductosTemplate>;
};
