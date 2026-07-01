import { create } from "zustand";
import {
  ConfirmarVenta,
  EliminarVenta,
  EliminarVentasIncompletas,
  InsertarVentas,
  MostrarVentasXsucursal,
  useClientesProveedoresStore,
} from "../index";
import { toast } from "sonner";

const initialState = {
  items: [],
  total: 0,
  idventa: 0,
  statePantallaCobro: false,
  tipocobro: "",
  stateMetodosPago: false,
};

export const useVentasStore = create((set, get) => ({
  ...initialState,
  porcentajeCambio: 0,
  dataventas: [],
  resetState: () => {
    const { selectCliPro } = useClientesProveedoresStore.getState();
    selectCliPro([]);
    set(initialState);
  },
  setStatePantallaCobro: (p) =>
    set((state) => {
      if (p.data.length === 0) {
        toast.warning(
          "Creo que deberías agregar un producto. Bueno... Solo digo 😆",
        );
        return {
          state,
        };
      } else {
        return {
          statePantallaCobro: !state.statePantallaCobro,
          tipocobro: p.tipocobro,
        };
      }
    }),
  setStateMetodosPago: () =>
    set((state) => ({ stateMetodosPago: !state.stateMetodosPago })),
  insertarVentas: async (p) => {
    const result = await InsertarVentas(p);
    console.log("resultado insertarVentas:", result);
    set({ idventa: result?.id });
    return result;
  },
  eliminarventasIncompletas: async (p) => {
    await EliminarVentasIncompletas(p);
  },
  mostrarventasxsucursal: async (p) => {
    const response = await MostrarVentasXsucursal(p);
    set({ dataventas: response });
    set({ idventa: response?.id ? response?.id : 0 });
    return response;
  },
  confirmarVenta: async (p) => {
    const response = await ConfirmarVenta(p);
    set({ dataventas: response });
    return response;
  },
  eliminarVenta: async (p) => {
    const { resetState } = get();
    await EliminarVenta(p);
    resetState();
  },
}));
