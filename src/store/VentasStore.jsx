import { create } from "zustand";
import { EliminarVentasIncompletas, InsertarVentas } from "../index";

export const useVentasStore = create((set) => ({
  idventa: 0,
  insertarVentas: async (p) => {
    const result = await InsertarVentas(p);
    set({ idventa: result?.id });
    return result;
  },
  eliminarventasIncompletas: async (p) => {
    await EliminarVentasIncompletas(p);
  },
}));
