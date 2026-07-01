import { create } from "zustand";
import {
  EditarSerealizacion,
  EditarSerealizacionDefault,
  MostrarSerealizaciones,
  MostrarSerealizacionesVentas,
} from "../supabase/crudSerealizaciones";

export const useSerealizacionesStore = create((set) => ({
  dataComprobantes: null,
  itemSelectComprobanteSelect: null,
  setItemSelectComprobanteSelect: (p) =>
    set({ itemSelectComprobanteSelect: p }),
  mostrarSerealizaciones: async (p) => {
    const response = await MostrarSerealizaciones(p);
    return response;
  },
  mostrarSerealizacionesVentas: async (p) => {
    const response = await MostrarSerealizacionesVentas(p);
    set({ dataComprobantes: response });
    set({ itemSelectComprobanteSelect: response[0] });
    return response;
  },
  editarSerealizacionDefaul: async (p) => {
    await EditarSerealizacionDefault(p);
  },
  editarSerealizacion: async (p) => {
    await EditarSerealizacion(p);
  },
}));
