import { create } from "zustand";
import {
  InsertarStock,
  MostrarStockAlmacenYProduct,
} from "../supabase/crudStock";
import {} from "../supabase/crudAlmacenes";

export const useStockStore = create((set) => ({
  insertarStock: async (p) => {
    await InsertarStock(p);
  },
  dataStockXAlmacenYProducto: [],
  mostrarStockAlmacenYProduct: async (p) => {
    const response = await MostrarStockAlmacenYProduct(p);
    set({ dataStockXAlmacenYProducto: response });
    return response;
  },
}));
