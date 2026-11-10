import { create } from "zustand";
import {
  InsertarMovStock,
  MostrarMovStock,
  MostrarTotalInventario,
} from "../supabase/crudMovimientosStock";

export const useMovStockStore = create((set) => ({
  tipo: "ingreso",
  setTipo: (p) => {
    set({ tipo: p });
  },
  insertarMovStock: async (p) => {
    await InsertarMovStock(p);
  },
  mostrarMovStock: async (p) => {
    const result = await MostrarMovStock(p);
    return result;
  },
  mostrarTotalInventario: async (p) => {
    const response = await MostrarTotalInventario(p);
    return response;
  },
}));
