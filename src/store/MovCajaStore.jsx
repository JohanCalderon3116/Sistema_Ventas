import { create } from "zustand";
import {
  InsertarMovCaja,
  MostrarEfectivoSinVentasMovCierreCaja,
  MostrarVentasMetodoPagoMovCaja,
} from "../supabase/crudMovimientosCaja";

export const useMovCajaStore = create((set, get) => ({
  totalVentasMetodoPago: 0,
  totalVentasEfectivo: 0,
  totalAperturaCaja: 0,
  totalGastosVariosCaja: 0,
  totalIngresosVariosCaja: 0,
  totalEfectivoCajaSinVentas: 0,
  totalEfectivoTotalCaja: 0,
  updateTotalEfectivoTotalCaja: () => {
    const { totalEfectivoCajaSinVentas, totalVentasEfectivo } = get();
    const total = totalEfectivoCajaSinVentas + totalVentasEfectivo;
    set({ totalEfectivoTotalCaja: total });
  },
  setTotalEfectivoCajaSinVentas: (p) => {
    set({ totalEfectivoCajaSinVentas: p });
    get().updateTotalEfectivoTotalCaja(); //recalcular el total
  },
  setTotalVentasEfectivo: (p) => {
    set({ totalVentasEfectivo: p });
    get().updateTotalEfectivoTotalCaja(); //recalcular el total
  },
  insertarMovcaja: async (p) => {
    await InsertarMovCaja(p);
  },
  mostrarEfectivoSinVentasMovCierreCaja: async (p) => {
    const result = await MostrarEfectivoSinVentasMovCierreCaja(p);
    //filtrar solo los movimientos de tipo apertura
    const movimientosApertura = result.filter(
      (item) => item.tipo_movimiento === "apertura",
    );
    //sumar la columna "monto" solo para los movimientos tipo "apertura"
    const totalApertura = movimientosApertura.reduce(
      (total, item) => total + (item.monto || 0),
      0,
    );
    set({ totalAperturaCaja: totalApertura });

    //hacemos lo mismo pero con ingreso
    const movimientoIngreso = result.filter(
      (item) => item.tipo_movimiento === "ingreso",
    );

    const totalIngreso = movimientoIngreso.reduce(
      (total, item) => total + (item.monto || 0),
      0,
    );
    set({ totalIngresosVariosCaja: totalIngreso });

    const movimientoSalida = result.filter(
      (item) => item.tipo_movimiento === "salida",
    );
    //hacemos lo mismo pero con salida
    const totalSalida = movimientoSalida.reduce(
      (total, item) => total + (item.monto || 0),
      0,
    );
    set({ totalGastosVariosCaja: totalSalida });
    const totalEfectivoCajaSinVentas =
      totalApertura + totalIngreso - totalSalida;
    set({ totalEfectivoCajaSinVentas: totalEfectivoCajaSinVentas });
    get().setTotalEfectivoCajaSinVentas(totalEfectivoCajaSinVentas);
    return result;
  },
  mostrarVentasMetodoPagoMovCaja: async (p) => {
    const result = await MostrarVentasMetodoPagoMovCaja(p);
    //sumamos el total
    const totalMonto = result.reduce(
      (total, item) => total + (item.monto || 0),
      0,
    );
    //filtrar solo ventas en efectivo
    const ventasEfectivo = result.filter(
      (item) => item.metodo_pago === "Efectivo",
    );
    // sumar la columna monto solo para evntas en efectivo
    const totalEfectivo = ventasEfectivo.reduce(
      (total, item) => total + (item.monto || 0),
      0,
    );
    set({ totalVentasMetodoPago: totalMonto });
    set({ totalVentasEfectivo: totalEfectivo });
    get().setTotalVentasEfectivo(totalEfectivo);
    return result;
  },
}));
