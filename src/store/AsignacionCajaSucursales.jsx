import { create } from "zustand";
import {
  BuscarUsuariosAsignados,
  InsertarAsignacionSucusal,
  MostrarSucursalCajaAsignada,
  MostrarUsuariosAsignados,
} from "../supabase/crudAsignacionSucursales";
export const useAsignacionCajaSucursalesStore = create((set) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  accion: "",
  setAccion: (p) => {
    set({ accion: p });
  },
  selectItem: null,
  setSelectItem: (p) => {
    set({ selectItem: p });
  },
  datSucursalesAsignadas: null,
  sucursalesItemSelectAsignadas: null,
  mostrarSucursalCajaAsignada: async (p) => {
    const response = await MostrarSucursalCajaAsignada(p);
    set({ datSucursalesAsignadas: response });
    set({ sucursalesItemSelectAsignadas: response[0] });
    return response;
  },
  dataUsuariosAsignados: [],
  mostrarUsariosAsignados: async (p) => {
    const response = await MostrarUsuariosAsignados(p);
    set({ dataUsuariosAsignados: response });
    return response;
  },
  buscarUsariosAsignados: async (p) => {
    const response = await BuscarUsuariosAsignados(p);
    set({ dataUsuariosAsignados: response });
    return response;
  },
  insertarAsignacionSucusal: async (p) => {
    await InsertarAsignacionSucusal(p);
  },
}));
