import { useQuery } from "@tanstack/react-query";
import {
  Spinner1,
  useEmpresaStore,
  MarcaTemplate,
  useMarcaStore,
} from "../index";

export const Marca = () => {
  const { mostrarmarca, buscarmarca, buscador } =
    useMarcaStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar marcas", dataempresa?.id],
    queryFn: () => mostrarmarca({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const {} = useQuery({
    queryKey: ["buscar marca", buscador],
    queryFn: () =>
      buscarmarca({ id_empresa: dataempresa?.id, marca: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  // if (error) {
  //   return <span>Error...</span>;
  // }
  return <MarcaTemplate></MarcaTemplate>;
};
