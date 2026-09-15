import { create } from "zustand";
import { MostrarMoneda } from "../supabase/crudMoneda";

export const useMonedaStore = create((set) => ({
  dataMoneda: "",
  mostrarMoneda: async () => {
    const response = await MostrarMoneda();
    set({ dataMoneda: response });
    return response;
  },
}));
