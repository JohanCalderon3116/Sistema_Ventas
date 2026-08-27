import { create } from "zustand";
import {
  EditarMetodosPago,
  EliminarMetodosPago,
  InsertarMetodosPago,
  MostrarMetodosPago,
} from "../supabase/crudMetodoPago";

export const useMetodosPagoStore = create((set) => ({
  dataMetodosPago: null,
  selectMetodo: null,
  file: [],
  setFile: (p) => {
    set({ file: p });
  },
  setSelectMetodo: (p) => {
    set({ selectMetodo: p });
  },
  mostrarMetodosPago: async (p) => {
    const response = await MostrarMetodosPago(p);
    set({ dataMetodosPago: response });
    return response;
  },
  metodosPagoItemSelect: [],
  selectMetodosPago: (p) => {
    set({ metodosPagoItemSelect: p });
  },
  insertarMetodosPago: async (p, file) => {
    await InsertarMetodosPago(p, file);
  },
  eliminarMetodosPago: async (p) => {
    await EliminarMetodosPago(p);
  },
  editarMetodosPago: async (p, fileold, filenew) => {
    await EditarMetodosPago(p, fileold, filenew);
  },
}));
