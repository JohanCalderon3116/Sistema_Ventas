import { create } from "zustand";
import { InsertarMovCaja } from "../supabase/crudMovimientosCaja";

export const useMovCajaStore = create((set) => ({
  insertarMovcaja: async (p) => {
    await InsertarMovCaja(p);
  },
}));
