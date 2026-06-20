import { create } from "zustand";
import { MostrarContraseña } from "../supabase/crudContraseña";

export const useContraseñaStore = create((set) => ({
  dataContraseña: "",
  mostrarContraseña: async () => {
    const response = await MostrarContraseña();
    set({ dataContraseña: response });
    return response;
  },
}));
