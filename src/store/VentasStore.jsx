import { create } from "zustand";
import {
  EliminarVentasIncompletas,
  InsertarVentas,
  MostrarVentasXsucursal,
} from "../index";

export const useVentasStore = create((set) => ({
  porcentajeCambio: 0,
  idventa: 0,
  dataventas: [],
  resetarventas: () => set({ idventa: 0 }),
  insertarVentas: async (p) => {
    const result = await InsertarVentas(p);
    set({ idventa: result?.id });
    return result;
  },
  eliminarventasIncompletas: async (p) => {
    await EliminarVentasIncompletas(p);
  },
  mostrarventasxsucursal: async (p) => {
    const response = await MostrarVentasXsucursal(p);
    set({ dataventas: response });
    set({ idventa: response?.id ? response?.id : 0 });
    return response;
  },
}));
