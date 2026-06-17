import { create } from "zustand";
import {
  EditarStock,
  InsertarStock,
  MostrarStockAlmacenesYProducto,
  MostrarStockAlmacenYProduct,
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
  mostrarStockAlmacenYProduct: async (p) => {
    const response = await MostrarStockAlmacenYProduct(p);
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
}));
