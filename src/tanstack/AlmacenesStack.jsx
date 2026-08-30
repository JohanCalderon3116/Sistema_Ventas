import { useQuery } from "@tanstack/react-query";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useSucursalesStore } from "../store/SucursalesStore";

export const useMostrarAlmacenesXSucursalQueryStack = () => {
  const { mostrarAlmacenesXSucursal } = useAlmacenesStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: [
      "mostrar almacenes por sucursal",
      dataCierreCaja?.caja?.id_sucursal,
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
      }),
    enabled: !!dataCierreCaja,
    refetchOnWindowFocus: false,
  });
};
export const useMostrarAlmacenesXSucursalItemSelectQueryStack = () => {
  const { mostrarAlmacenesXSucursal } = useAlmacenesStore();
  const { sucursalesItemSelect, dataSucursales } = useSucursalesStore();
  return useQuery({
    queryKey: ["mostrar almacenes por sucursal"],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: sucursalesItemSelect?.id,
      }),
    enabled: !!dataSucursales,
    refetchOnWindowFocus: false,
  });
};
