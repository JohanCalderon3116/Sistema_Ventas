import { create } from "zustand";
import {
  EditarCantidadDetalleVenta,
  EliminarDetalleVentas,
  InsertarDetalleVentas,
  MostrarDetalleVenta,
  MostrarTop10ProductosMasVenidosPorMonto,
  MostrarTop5ProductosMasVenidosPorCantidad,
} from "../index";
function calcularTotal(items) {
  return items.reduce(
    (total, item) => total + item.precio_venta * item.cantidad,
    0,
  );
}
export const useDetalleVentasStore = create((set, get) => ({
  detalleventa: [],
  parametros: {},
  total: 0,
  mostrardetalleventa: async (p) => {
    const response = await MostrarDetalleVenta(p);
    set({
      detalleventa: response,
    });
    set({ total: calcularTotal(response) });
    return response;
  },
  insertarDetalleVentas: async (p) => {
    await InsertarDetalleVentas(p);
  },
  eliminardetalleventa: async (p) => {
    await EliminarDetalleVentas(p);
  },
  mostrarTop5ProductosMasVenidosPorCantidad: async (p) => {
    const response = await MostrarTop5ProductosMasVenidosPorCantidad(p);
    return response;
  },
  mostrarTop10ProductosMasVenidosPorMonto: async (p) => {
    const response = await MostrarTop10ProductosMasVenidosPorMonto(p);
    return response;
  },
  editarCantidadDetalleVenta: async (p) => {
    await EditarCantidadDetalleVenta(p);
  },
}));
