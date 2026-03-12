import { create } from "zustand";
import { MostrarModulos } from "../index";

export const useModulosStore = create((set) => ({
  dataModulos: [],
  mostrarmodulos: async () => {
    const response = await MostrarModulos();
    set({ dataModulos: response });
    return response;
  },
}));
