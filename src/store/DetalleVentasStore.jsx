import { create } from "zustand";
import {
  CalcularGananciasXEmpresa,
  ContarVentasXEmpresa,
  EditarCantidadDetalleVenta,
  EliminarDetalleVentas,
  InsertarDetalleVentas,
  MostrarDetalleVenta,
  MostrarTop10ProductosMasVenidosPorMonto,
  MostrarTop5ProductosMasVenidosPorCantidad,
  MostrarVentasAgrupadasFecha,
  SumarTotalVentasXEmpresa,
} from "../index";

function calcularTotal(items) {
  return items.reduce(
    (total, item) => total + item.precio_venta * item.cantidad,
    0,
  );
}

export const redondear = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function calcularDescuento(total, porcentaje) {
  const valorDescuento = redondear(total * (porcentaje / 100));
  const totalAPagar = redondear(total - valorDescuento);
  return { valorDescuento, totalAPagar };
}

export const useDetalleVentasStore = create((set, get) => ({
  detalleventa: [],
  parametros: {},
  cantidadVentas: 0,
  porcentajeCambio: 0,
  totalVentas: 0,
  porcentajeCambioTotal: 0,
  totalGanancias: 0,
  porcentajeCambioGanancias: 0,
  ventasAgrupadasFecha: 0,
  total: 0,
  porcentajeDescuento: 0,
  valorDescuento: 0,
  totalAPagar: 0,
  setPorcentajeDescuento: (porcentaje) => {
    const p = Number(porcentaje) || 0;
    set({
      porcentajeDescuento: p,
      ...calcularDescuento(get().total, p),
    });
  },
  resetDetalleVenta: () => {
    set({
      detalleventa: [],
      total: 0,
      porcentajeDescuento: 0,
      valorDescuento: 0,
      totalAPagar: 0,
    });
  },
  mostrardetalleventa: async (p) => {
    const response = await MostrarDetalleVenta(p);
    const items = response ?? [];
    const total = calcularTotal(items);
    set({
      detalleventa: items,
      total,
      ...calcularDescuento(total, get().porcentajeDescuento),
    });
    return items;
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
  contarVentasXEmpresa: async (p) => {
    const response = await ContarVentasXEmpresa(p);
    const datos = response?.[0];
    set({
      cantidadVentas: datos?.total_ventas ?? 0,
      porcentajeCambio: datos?.porcentaje_cambio ?? 0,
    });
    return datos;
  },
  sumarTotalVentasXEmpresa: async (p) => {
    const response = await SumarTotalVentasXEmpresa(p);
    set({
      totalVentas: response?.total_ventas ?? 0,
      porcentajeCambioTotal: response?.porcentaje_cambio ?? 0,
    });
    return response;
  },
  calcularGananciasXEmpresa: async (p) => {
    const response = await CalcularGananciasXEmpresa(p);
    set({
      totalGanancias: response?.total_ganancias ?? 0,
      porcentajeCambioGanancias: response?.porcentaje_cambio ?? 0,
    });
    return response;
  },
  mostrarVentasAgrupadasFecha: async (p) => {
    const response = await MostrarVentasAgrupadasFecha(p);
    set({ ventasAgrupadasFecha: response ?? [] });
    return response;
  },
  editarCantidadDetalleVenta: async (p) => {
    await EditarCantidadDetalleVenta(p);
  },
}));
