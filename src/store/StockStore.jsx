import { create } from "zustand";
import {
  EditarStock,
  InsertarStock,
  MostrarAlertasStockXVenta,
  MostrarStockAlmacenesYProducto,
  MostrarStockAlmacenYProducto,
} from "../supabase/crudStock";
import {} from "../supabase/crudAlmacenes";

export const useStockStore = create((set) => ({
  stateModal: false,
  setStateModal: (p) => {
    set({ stateModal: p });
  },
  insertarStock: async (p) => {
    await InsertarStock(p);
  },
  dataStockXAlmacenYProducto: [],
  mostrarStockAlmacenYProducto: async (p) => {
    const response = await MostrarStockAlmacenYProducto(p);
    set({ dataStockXAlmacenYProducto: response });
    return response;
  },
  dataStockXAlmacenesYProducto: [],
  mostrarStockAlmacenesYProducto: async (p) => {
    const response = await MostrarStockAlmacenesYProducto(p);
    set({ dataStockXAlmacenesYProducto: response });
    return response;
  },
  editarStock: async (p, tipo) => {
    await EditarStock(p, tipo);
  },
  mostrarAlertasStockXVenta: async (p) => {
    const response = await MostrarAlertasStockXVenta(p);
    return response;
  },
}));
