import { create } from "zustand";
import {
  InsertarMovimientosCreditos,
  ObtenerMovimientosCreditoPorCredito,
} from "../supabase/crudMovimientosCreditos";

export const useMovimientosCreditosStore = create((set) => ({
  stateIngresoCredito: false,
  setStateIngresoCredito: (p) => {
    set({ stateIngresoCredito: p });
  },
  insertarMovimientosCreditos: async (p) => {
    await InsertarMovimientosCreditos(p);
  },
  isHistorialOpen: false,
  abrirHistorial: () => set({ isHistorialOpen: true }),
  cerrarHistorial: () => set({ isHistorialOpen: false }),

  obtenerMovimientosCredito: async (p) =>
    await ObtenerMovimientosCreditoPorCredito(p),
  isTicketCreditoOpen: false,
  idVentaCreditoSeleccionada: null,
  abrirTicketCredito: (p) =>
    set({ isTicketCreditoOpen: true, idVentaCreditoSeleccionada: p }),
  cerrarTicketCredito: () =>
    set({ isTicketCreditoOpen: false, idVentaCreditoSeleccionada: null }),
}));
