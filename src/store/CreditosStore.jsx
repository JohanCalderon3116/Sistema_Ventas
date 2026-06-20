import { create } from "zustand";
import {
  BuscarCreditos,
  InsertarCredito,
  MostrarCreditos,
} from "../supabase/crudCreditos";

export const useCreditosStore = create((set) => ({
  datacreditos: [],
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
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
    set({ creditosItemSelect: response });
    return response;
  },
  buscarCreditos: async (p) => {
    const response = await BuscarCreditos(p);
    set({ datacreditos: response });
    return response;
  },
}));
