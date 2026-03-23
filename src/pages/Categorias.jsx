import { useQuery } from "@tanstack/react-query";
import {
  CategoriasTemplate,
  Spinner1,
  useCategroriasStore,
  useEmpresaStore,
} from "../index";

export const Categorias = () => {
  const { mostrarCategorias, buscarCategorias, buscador } =
    useCategroriasStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const {} = useQuery({
    queryKey: ["buscar categorias", buscador],
    queryFn: () =>
      buscarCategorias({ id_empresa: dataempresa?.id, descripcion: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  // if (error) {
  //   return <span>Error...</span>;
  // }
  return <CategoriasTemplate></CategoriasTemplate>;
};
