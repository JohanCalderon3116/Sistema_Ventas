import { create } from "zustand";
import { InsertarDetalleVentas } from "../index";

export const useDetalleVentasStore = create((set) => ({
  insertarDetalleVentas: async (p) => {
    await InsertarDetalleVentas(p);
  },
}));
