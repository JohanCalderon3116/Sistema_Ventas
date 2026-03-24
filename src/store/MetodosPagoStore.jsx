import { create } from "zustand";
import { MostrarMetodosPago } from "../supabase/crudMetodoPago";

export const useMetodosPagoStore = create((set) => ({
  dataMetodosPago: null,
  mostrarMetodosPago: async (p) => {
    const response = await MostrarMetodosPago(p);
    set({ dataMetodosPago: response });
    return response;
  },
}));
