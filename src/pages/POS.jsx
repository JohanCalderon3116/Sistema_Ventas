import { useQuery } from "@tanstack/react-query";
import {
  POSTemplate,
  Spinner1,
  SpinnerSecundario,
  useAlmacenesStore,
  useEmpresaStore,
  useProductosStore,
  useSucursalesStore,
  useVentasStore,
} from "../index";

export function POS() {
  const { buscarProductos, buscador, ProductosItemSelect } =
    useProductosStore();
  const { mostrarAlmacenXsucursal } = useAlmacenesStore();
  const { sucursalesItemSelectAsignadas } = useSucursalesStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarventasxsucursal } = useVentasStore();
  useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const { isLoading, error } = useQuery({
    queryKey: [
      "mostrar almacen por sucursal",
      sucursalesItemSelectAsignadas.id_sucursal,
    ],
    queryFn: () =>
      mostrarAlmacenXsucursal({
        id_sucursal: sucursalesItemSelectAsignadas.id_sucursal,
      }),
  });
  useQuery({
    queryKey: [
      "mostrar ventas por sucursal",
      sucursalesItemSelectAsignadas.id_sucursal,
    ],
    queryFn: () =>
      mostrarventasxsucursal({
        id_sucursal: sucursalesItemSelectAsignadas.id_sucursal,
      }),
    enabled: !!sucursalesItemSelectAsignadas,
  });
  // if (isLoading) {
  //   return (
  //     <span>
  //       <SpinnerSecundario texto="Cargando ventas..."></SpinnerSecundario>
  //     </span>
  //   );
  // }
  // if (error) {
  //   return <span>Error {error.message} </span>;
  // }
  return <POSTemplate></POSTemplate>;
}
