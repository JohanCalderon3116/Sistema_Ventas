import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore, useSucursalesStore } from "..";

export const useMostrarSucursalesXEmpresaStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarSucursales } = useSucursalesStore();
  return useQuery({
    queryKey: ["mostrar sucursales", dataempresa?.id],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
