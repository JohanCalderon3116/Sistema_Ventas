import { create } from "zustand";
import {
  EditarCaja,
  EliminarCaja,
  InsertarCaja,
  MostrarCajaXSucursal,
} from "../supabase/crudCaja";

export const useCajasStore = create((set) => ({
  stateCaja: false,
  setStateCaja: (p) => set({ stateCaja: p }),
  accion: "",
  setAccion: (p) => set({ accion: p }),
  cajaSelelctItem: [],
  setCajaSelelctItem: (p) => set({ cajaSelelctItem: p }),
  dataCaja: null,
  mostrarCajaXSucursal: async (p) => {
    const response = await MostrarCajaXSucursal(p);
    set({ cajaSelelctItem: response[0] });
    set({ dataCaja: response });
    return response;
  },
  insertarCaja: async (p) => {
    const response = await InsertarCaja(p);
    return response;
  },
  editarCaja: async (p) => {
    await EditarCaja(p);
  },
  eliminarCaja: async (p) => {
    await EliminarCaja(p);
  },
}));
