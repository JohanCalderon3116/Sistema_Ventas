import { create } from "zustand";
import { InsertarCredito, MostrarCreditos } from "../supabase/crudCreditos";

export const useCreditosStore = create((set) => ({
  datacreditos: [],
  creditosItemSelect: null,
  setCreditosItemSelect: (p) => {
    set({ creditosItemSelect: p });
  },
  insertarCredito: async (p) => {
    const response = await InsertarCredito(p);
    return response;
  },
  mostrarCreditos: async (p) => {
    const response = await MostrarCreditos(p);
    set({ datacreditos: response });
    set({ creditosItemSelect: response[0] });
    return response;
  },
}));
