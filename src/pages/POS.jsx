import { useQuery } from "@tanstack/react-query";
import {
  PantallaAperturaCaja,
  POSTemplate,
  Spinner1,
  SpinnerSecundario,
  useAlmacenesStore,
  useCierreCajaStore,
  useEmpresaStore,
  useProductosStore,
  useSucursalesStore,
  useVentasStore,
} from "../index";
import { useCajasStore } from "../store/CajaStore";

export function POS() {
  const { buscarProductos, buscador, ProductosItemSelect } =
    useProductosStore();
  const { mostrarAlmacenXsucursal } = useAlmacenesStore();
  const { sucursalesItemSelectAsignadas } = useSucursalesStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarventasxsucursal } = useVentasStore();
  const { mostrarCajaXSucursal } = useCajasStore();
  const { mostrarCierreCaja } = useCierreCajaStore();
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
  const { data: dataCaja } = useQuery({
    queryKey: [
      "mostrar caja por sucursal",
      { id_sucursal: sucursalesItemSelectAsignadas?.id_sucursal },
    ],
    queryFn: () =>
      mostrarCajaXSucursal({
        id_sucursal: sucursalesItemSelectAsignadas?.id_sucursal,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingCierreCaja,
    data: dataCierreCaja,
    error: errorCierreCaja,
  } = useQuery({
    queryKey: ["mostrar cierre de caja", { id_caja: dataCaja?.id }],
    queryFn: () =>
      mostrarCierreCaja({
        id_caja: dataCaja?.id,
      }),
    enabled: !!dataCaja,
  });
  //Mostrar spinner mientras carga la informacion de caja
  if (isLoadingCierreCaja) {
    return (
      <span>
        <SpinnerSecundario texto="Cargando ventas..."></SpinnerSecundario>
      </span>
    );
  }
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
