import { useQuery } from "@tanstack/react-query";
import {
  Spinner1,
  useEmpresaStore,
  ProductosTemplate,
  useProductosStore,
} from "../index";

export const Productos = () => {
  const { mostrarProductos, buscarProductos, buscador } =
    useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () => mostrarProductos({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const {} = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, marca: buscador }),
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
