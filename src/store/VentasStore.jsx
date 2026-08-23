import { create } from "zustand";
import {
  ConfirmarVenta,
  EliminarVenta,
  EliminarVentasIncompletas,
  InsertarVentas,
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
  restante: 0,
  setRestante: (p) => {
    set({ restante: p });
  },
  vuelto: 0,
  setVuelto: (p) => {
    set({ vuelto: p });
  },
  valoresPago: {},
  setValoresPago: (p) => {
    set((state) => ({
      valoresPago: typeof p === "function" ? p(state.valoresPago) : p,
    }));
  },
  insertarVentas: async (p) => {
    const result = await InsertarVentas(p);
    console.log("resultado insertarVentas:", result);
    set({ idventa: result?.id });
    return result;
  },
  eliminarventasIncompletas: async (p) => {
    await EliminarVentasIncompletas(p);
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
