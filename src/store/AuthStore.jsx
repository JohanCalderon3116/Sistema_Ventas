import { create } from "zustand";
import { ObtenerIdAuthSupabase } from "../supabase/crudUsuarios";
import { supabase } from "../supabase/supabase.config";
import { useUsuariosStore } from "./UsuariosStore";
import { useEmpresaStore } from "./EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "./AsignacionCajaSucursales";
import { usePermisosStore } from "./PermisosStore";
import { useCierreCajaStore } from "./CierreCajaStore";
import { useVentasStore } from "./VentasStore";
import { useDetalleVentasStore } from "./DetalleVentasStore";
import { useCartVentasStoreTemporal } from "./CartVentasStoreTemporal";
import { useProductosStore } from "./ProductosStore";
import { useClientesProveedoresStore } from "./ClientesProveedoresStore";
import { useCategoriasStore } from "./CategoriasStore";
import { useAlmacenesStore } from "./AlmacenesStore";
import { useSucursalesStore } from "./SucursalesStore";
import { useCajasStore } from "./CajaStore";
import { useCreditosStore } from "./CreditosStore";
import { useMetodosPagoStore } from "./MetodosPagoStore";
import { useMovCajaStore } from "./MovCajaStore";
import { useStockStore } from "./StockStore";
import { useDashboardStore } from "./DashboardStore";

const DURACION_TRANSICION_SALIDA_MS = 250;

export const limpiarEstadoSesion = () => {
  useUsuariosStore.setState({
    datausuarios: null,
    refetchs: null,
    usuariosEnLinea: {},
  });

  useEmpresaStore.setState({
    dataempresa: null,
  });

  useAsignacionCajaSucursalesStore.setState({
    buscador: "",
    accion: "",
    selectItem: null,
    datSucursalesAsignadas: null,
    sucursalesItemSelectAsignadas: null,
    dataUsuariosAsignados: [],
  });

  usePermisosStore.setState({
    dataPermisos: [],
    selectModules: [],
    dataPermisosGlobales: [],
    dataPermisosConfiguraciones: [],
  });

  useCierreCajaStore.setState({
    stateConteoCaja: false,
    stateIngresoSalida: false,
    stateCierreCaja: false,
    tipoRegistro: "",
    dataCierreCaja: null,
    cierreCjaItemSelect: null,
  });

  useVentasStore.setState({
    items: [],
    total: 0,
    idventa: 0,
    statePantallaCobro: false,
    tipocobro: "",
    stateMetodosPago: false,
    porcentajeCambio: 0,
    dataventas: [],
    catidadInput: 1,
    restante: 0,
    vuelto: 0,
    valoresPago: {},
    isTicketOpen: false,
    idVentaSeleccionada: null,
  });

  useDetalleVentasStore.setState({
    detalleventa: [],
    parametros: {},
    cantidadVentas: 0,
    porcentajeCambio: 0,
    totalVentas: 0,
    porcentajeCambioTotal: 0,
    totalGanancias: 0,
    porcentajeCambioGanancias: 0,
    ventasAgrupadasFecha: 0,
    total: 0,
    porcentajeDescuento: 0,
    valorDescuento: 0,
    totalAPagar: 0,
  });

  try {
    useCartVentasStoreTemporal.getState().resetState();
    localStorage.removeItem("cart-ventas-storage");
  } catch (e) {
    console.error(e);
  }

  useProductosStore.setState({
    refetchs: null,
    buscador: "",
    dataProductos: [],
    ProductosItemSelect: [],
    parametros: {},
    resultadosBusqueda: [],
  });

  useClientesProveedoresStore.setState({
    tipo: "",
    buscador: "",
    dataclipro: [],
    cliproItemSelect: [],
    parametros: {},
  });

  useCategoriasStore.setState({
    buscador: "",
    file: [],
    datacategorias: [],
    categoriaItemSelect: [],
    parametros: {},
  });

  useAlmacenesStore.setState({
    stateAlmacen: false,
    accion: "",
    almacenSelelctItem: [],
    dataalmacen: [],
    dataalmacenxsucursal: [],
    dataAlmacenesXEmpresa: null,
    dataAlmacenesXSucursa: null,
  });

  useSucursalesStore.setState({
    stateSucursal: false,
    accion: "",
    sucursalesItemSelect: [],
    dataSucursales: null,
  });

  useCajasStore.setState({
    stateCaja: false,
    accion: "",
    cajaSelelctItem: [],
    dataCaja: null,
  });

  useCreditosStore.setState({
    datacreditos: [],
    buscador: "",
    creditosItemSelect: null,
  });

  useMetodosPagoStore.setState({
    dataMetodosPago: null,
    selectMetodo: null,
    file: [],
    metodosPagoItemSelect: [],
  });

  useMovCajaStore.setState({
    fechaInicio: null,
    fechaFin: null,
    totalVentasMetodoPago: 0,
    totalVentasEfectivo: 0,
    totalAperturaCaja: 0,
    totalGastosVariosCaja: 0,
    totalIngresosVariosCaja: 0,
    totalEfectivoCajaSinVentas: 0,
    totalEfectivoTotalCaja: 0,
    montoEfectivo: 0,
  });

  useStockStore.setState({
    stateModal: false,
    dataStockXAlmacenYProducto: [],
    dataStockXAlmacenesYProducto: [],
  });

  useDashboardStore.setState({
    fechaInicio: null,
    fechaFin: null,
  });
};

export const useAuthStore = create((set) => ({
  isSigningOut: false,
  loginGoogle: async () => {
    limpiarEstadoSesion();
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  },
  cerrarSesion: async () => {
    set({ isSigningOut: true });
    await new Promise((resolve) =>
      setTimeout(resolve, DURACION_TRANSICION_SALIDA_MS),
    );
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          console.error("Error al cerrar sesión:", error.message);
          set({ isSigningOut: false });
          return false;
        }
      }
      limpiarEstadoSesion();
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      set({ isSigningOut: false });
      return false;
    }
  },
  finalizarCierreSesion: () => {
    set({ isSigningOut: false });
  },
  loginEmail: async (p) => {
    limpiarEstadoSesion();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    });
    if (error) {
      if (error.status === 400) {
        throw new Error("Correo y ontraseña no son validos");
      } else {
        throw new Error("Error al iniciar sesión: ", error.message);
      }
    }
    return data.user;
  },
  crearUserYLogin: async (p) => {
    const { data } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
    });
    return data.user;
  },
  obtenerIdAuthSupabase: async () => {
    const response = await ObtenerIdAuthSupabase();
    return response;
  },
}));
