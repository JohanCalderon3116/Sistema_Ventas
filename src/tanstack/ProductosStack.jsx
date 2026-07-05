import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";

export const useBuscarproductosQueryStack = () => {
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
