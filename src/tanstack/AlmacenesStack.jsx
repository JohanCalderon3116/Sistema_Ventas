import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";

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
