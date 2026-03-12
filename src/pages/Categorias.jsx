import { useQuery } from "@tanstack/react-query";
import {
  CategoriasTemplate,
  useCategroriasStore,
  useEmpresaStore,
} from "../index";

export const Categorias = () => {
  const { mostrarCategorias } = useCategroriasStore();
  const { dataempresa } = useEmpresaStore();
  const {} = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn:() => mostrarCategorias({ id_empresa: dataempresa?.id }),
  });
  return <CategoriasTemplate></CategoriasTemplate>;
};
