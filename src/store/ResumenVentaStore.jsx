import { create } from "zustand";

export const useResumenVentaStore = create((set) => ({
  open: false,
  datos: { total: 0, vuelto: 0, restante: 0 },
  mostrarResumenVenta: (datos) => set({ open: true, datos }),
  cerrarResumenVenta: () => set({ open: false }),
}));
