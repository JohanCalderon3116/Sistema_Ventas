import { create } from "zustand";
import {
  EliminarDetalleVentas,
  InsertarDetalleVentas,
  MostrarDetalleVenta,
  MostrarTop10ProductosMasVenidosPorMonto,
  MostrarTop5ProductosMasVenidosPorCantidad,
} from "../index";

export const useDetalleVentasStore = create((set, get) => ({
  detalleventa: [],
  parametros: {},
  total: 0,
  mostrardetalleventa: async (p) => {
    const response = await MostrarDetalleVenta(p);
    set({ parametros: p });
    set({
      detalleventa: response,
    });
    let total = 0;
    response?.forEach((item) => {
      const array = Object.values(item);
      total += array[4];
    });
    set({ total: total });
    return response;
  },
  insertarDetalleVentas: async (p) => {
    await InsertarDetalleVentas(p);
  },
  eliminardetalleventa: async (p) => {
    await EliminarDetalleVentas(p);
    const { mostrardetalleventa } = get();
    const { parametros } = get();
    set(mostrardetalleventa(parametros));
  },
  mostrarTop5ProductosMasVenidosPorCantidad: async (p) => {
    const response = await MostrarTop5ProductosMasVenidosPorCantidad(p);
    return response;
  },
  mostrarTop10ProductosMasVenidosPorMonto: async (p) => {
    const response = await MostrarTop10ProductosMasVenidosPorMonto(p);
    return response;
  },
}));
