import { create } from "zustand";
import {
  EliminarAlmacen,
  InsertarStockAlmacenes,
  MostrarStockAlmacenXSucursal,
} from "../index";

export const useAlmacenesStore = create((set) => ({
  dataalmacen: [],
  mostrarAlmacen: async (p) => {
    const respose = await MostrarStockAlmacenXSucursal(p);
    set({ dataalmacen: respose });
    return respose;
  },
  insertarStockAlmacenes: async (p) => {
    await InsertarStockAlmacenes(p);
  },
  eliminarAlmacen: async (p) => {
    await EliminarAlmacen(p);
  },
}));
