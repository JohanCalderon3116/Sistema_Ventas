import { create } from "zustand";
import { InsertarMovimientosCreditos } from "../supabase/crudMovimientosCreditos";

export const useMovimientosCreditosStore = create((set) => ({
  insertarMovimientosCreditos: async (p) => {
    await InsertarMovimientosCreditos(p);
  },
}));
