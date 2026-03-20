import { create } from "zustand";
import {
  EliminarAlmacen,
  InsertarStockAlmacenes,
  MostrarAlmacenXSucursal,
  MostrarStockAlmacenXSucursal,
} from "../index";

export const useAlmacenesStore = create((set, get) => ({
  dataalmacen: [],
  dataalmacenxsucursal: [],
  mostrarAlmacen: async (p) => {
    const response = await MostrarStockAlmacenXSucursal(p);
    set({ dataalmacen: response });
    return response;
  },
  mostrarAlmacenXsucursal: async (p) => {
    const response = await MostrarAlmacenXSucursal(p);
    set({ dataalmacenxsucursal: response });
    return response;
  },
  insertarStockAlmacenes: async (p) => {
    await InsertarStockAlmacenes(p);
  },
  eliminarAlmacen: async (p) => {
    await EliminarAlmacen(p);
  },
}));
