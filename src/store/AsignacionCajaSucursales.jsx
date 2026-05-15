import { create } from "zustand";
import { MostrarSucursalCajaAsignada } from "../supabase/crudAsignacionSucursales";
export const useAsignacionCajaSucursalesStore = create((set) => ({
  datSucursalesAsignadas: null,
  sucursalesItemSelectAsignadas: null,
  mostrarSucursalCajaAsignada: async (p) => {
    const response = await MostrarSucursalCajaAsignada(p);
    set({ datSucursalesAsignadas: response });
    set({ sucursalesItemSelectAsignadas: response });
    return response;
  },
}));
