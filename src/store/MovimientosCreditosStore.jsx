import { create } from "zustand";
import { InsertarMovimientosCreditos } from "../supabase/crudMovimientosCreditos";

export const useMovimientosCreditosStore = create((set) => ({
  stateIngresoCredito: false,
  setStateIngresoCredito: (p) => {
    set({ stateIngresoCredito: p });
  },
  insertarMovimientosCreditos: async (p) => {
    await InsertarMovimientosCreditos(p);
  },
}));
