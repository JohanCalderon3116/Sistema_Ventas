import { create } from "zustand";
import {
  EditarSucursal,
  EliminarSucursal,
  InsertarSucursal,
  MostrarCajasPorSucursal,
  MostrarSucursales,
} from "../index";

export const useSucursalesStore = create((set) => ({
  stateSucursal: false,
  setStateSucursal: (p) => set({ stateSucursal: p }),
  accion: "",
  setAccion: (p) => set({ accion: p }),
  sucursalesItemSelect: [],
  selectSucursal: (p) => {
    set({ sucursalesItemSelect: p });
  },
  dataSucursales: null,
  mostrarSucursales: async (p) => {
    const response = await MostrarSucursales(p);
    set({ dataSucursales: response });
    set({ sucursalesItemSelect: response[0] });
    return response;
  },
  mostrarCajasPorSucursal: async (p) => {
    const respose = await MostrarCajasPorSucursal(p);
    return respose;
  },
  editarSucursal: async (p) => {
    await EditarSucursal(p);
  },
  insertarSucursal: async (p) => {
    const response = await InsertarSucursal(p);
    return response;
  },
  eliminarSucursal: async (p) => {
    await EliminarSucursal(p);
  },
}));
