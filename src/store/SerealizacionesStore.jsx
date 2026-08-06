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
    const porDefault = response?.find((item) => item.por_default === true);
    set({ itemSelectComprobanteSelect: porDefault ?? response?.[0] ?? null });
    return response;
  },
  editarSerealizacionDefaul: async (p) => {
    await EditarSerealizacionDefault(p);
  },
  editarSerealizacion: async (p) => {
    await EditarSerealizacion(p);
  },
}));
