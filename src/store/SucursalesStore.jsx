import { create } from "zustand";
import { MostrarSucursales, MostrarSucursalesAsignadasXuser } from "../index";

export const useSucursalesStore = create((set) => ({
  sucursalesItemSelect: [],
  selectSucursal: (p) => {
    set({ sucursalesItemSelect: p });
  },
  dataSucursales: [],
  dataSucursalesAsgnadas: [],
  sucursalesItemSelectAsignadas: [],
  mostrarSucursales: async (p) => {
    const response = await MostrarSucursales(p);
    set({ dataSucursales: response });
    set({ sucursalesItemSelect: response[0] });
    return response;
  },
  mostrarSucursalesAsignadas: async (p) => {
    const respose = await MostrarSucursalesAsignadasXuser(p);
    set({ dataSucursalesAsgnadas: respose });
    set({sucursalesItemSelectAsignadas: respose[0]})
    return respose;
  },
}));
