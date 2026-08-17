import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useCategoriasStore } from "../store/CategoriasStore";

export const useMostrarCategoriasQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCategorias } = useCategoriasStore();
  return useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useBuscarCategoriasQueryStack = () => {
  const { buscador, buscarCategorias } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["buscar categorias", buscador],
    queryFn: () =>
      buscarCategorias({ id_empresa: dataempresa?.id, descripcion: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
