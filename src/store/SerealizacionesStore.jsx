import { create } from "zustand";
import {
  EditarSerealizacion,
  EditarSerealizacionDefault,
  MostrarSerealizaciones,
} from "../supabase/crudSerealizaciones";

export const useSerealizacionesStore = create((set) => ({
  mostrarSerealizaciones: async (p) => {
    const response = await MostrarSerealizaciones(p);
    return response;
  },
  editarSerealizacionDefaul: async (p) => {
    await EditarSerealizacionDefault(p);
  },
  editarSerealizacion: async (p) => {
    await EditarSerealizacion(p);
  },
}));
