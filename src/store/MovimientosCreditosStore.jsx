import { create } from "zustand";
import { InsertarMovimientosCreditos } from "../supabase/crudMovimientosCreditos";

export const useMovimientosCreditosStore = create((set) => ({
  insertarMovimientosCreditos: async (p) => {
    const response = await InsertarMovimientosCreditos(p);
    return response;
  },
}));
