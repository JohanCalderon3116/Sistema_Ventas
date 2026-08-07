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
