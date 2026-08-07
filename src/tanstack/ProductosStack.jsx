import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";

export const useBuscarProductosCodigoQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { buscador, buscarProductos } = useProductosStore();
  const texto = buscador.trim();
  const esCodigoDeBarras = /^[0-9]{3,}$/.test(texto);

  return useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: texto }),
    enabled: !!dataempresa && texto.length > 0 && !esCodigoDeBarras,
    refetchOnWindowFocus: false,
  });
};
export const useMostrarProductosQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarProductos } = useProductosStore();
  return useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () => mostrarProductos({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useBuscarProductosQueryStack = () => {
  const { buscarProductos, buscador } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
