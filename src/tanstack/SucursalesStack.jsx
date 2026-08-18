import { useQuery } from "@tanstack/react-query";
import { useCajasStore, useEmpresaStore, useSucursalesStore } from "..";

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
export const useMostrarCajasPorSucursalQueryStack = () => {
  const { sucursalesItemSelect } = useSucursalesStore();
  const { mostrarCajaXSucursal } = useCajasStore();
  return useQuery({
    queryKey: [
      "mostrar caja por sucursal",
      {
        id_sucursal: sucursalesItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarCajaXSucursal({
        id_sucursal: sucursalesItemSelect?.id,
      }),
    enabled: !!sucursalesItemSelect,
  });
};
