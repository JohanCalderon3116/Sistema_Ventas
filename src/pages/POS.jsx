import { useQuery } from "@tanstack/react-query";
import {
  PantallaAperturaCaja,
  POSTemplate,
  Spinner1,
  SpinnerSecundario,
  useAlmacenesStore,
  useCierreCajaStore,
  useEmpresaStore,
  useMetodosPagoStore,
  useProductosStore,
  useSucursalesStore,
  useVentasStore,
} from "../index";
import { useCajasStore } from "../store/CajaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";

export function POS() {
  const { buscarProductos, buscador, ProductosItemSelect } =
    useProductosStore();
  const { mostrarAlmacenXsucursal } = useAlmacenesStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalesStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarventasxsucursal } = useVentasStore();
  const { mostrarCajaXSucursal } = useCajasStore();
  const { mostrarCierreCaja } = useCierreCajaStore();
  const { mostrarMetodosPago } = useMetodosPagoStore();
  useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const { isLoading: isLoadingAlmacen, error } = useQuery({
    queryKey: [
      "mostrar almacen por sucursal",
      sucursalesItemSelectAsignadas?.id_sucursal,
    ],
    queryFn: () =>
      mostrarAlmacenXsucursal({
        id_sucursal: sucursalesItemSelectAsignadas?.id_sucursal,
      }),
  });
  useQuery({
    queryKey: [
      "mostrar ventas por sucursal",
      sucursalesItemSelectAsignadas?.id_sucursal,
    ],
    queryFn: () =>
      mostrarventasxsucursal({
        id_sucursal: sucursalesItemSelectAsignadas?.id_sucursal,
      }),
    enabled: !!sucursalesItemSelectAsignadas,
  });

  const {
    isLoading: isLoadingCierreCaja,
    data: dataCierreCaja,
    error: errorCierreCaja,
  } = useQuery({
    queryKey: [
      "mostrar cierre de caja",
      { id_caja: sucursalesItemSelectAsignadas?.id_caja },
    ],
    queryFn: () =>
      mostrarCierreCaja({
        id_caja: sucursalesItemSelectAsignadas?.id_caja,
      }),
    enabled: !!sucursalesItemSelectAsignadas,
  });
  const { isLoading: isLoadingMetodosPago } = useQuery({
    queryKey: ["mostrar metodos de pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  //unificar los estados de carga
  const isLoading =
    isLoadingAlmacen || isLoadingCierreCaja || isLoadingMetodosPago;
  //Mostrar spinner mientras carga la informacion de caja
  // if (isLoading) {
  //   return (
  //     <span>
  //       <Spinner1 texto="Cargando ventas..."></Spinner1>
  //     </span>
  //   );
  // }
  if (errorCierreCaja) {
    return <span>Error {errorCierreCaja.message} </span>;
  }
  //Mostrar aperturar caja si no hay datos de cierre de caja
  if (!dataCierreCaja) {
    if (dataCierreCaja === null) {
      return <PantallaAperturaCaja></PantallaAperturaCaja>;
    }
  }
  if (dataCierreCaja != null) {
    return <POSTemplate></POSTemplate>;
  }
}
