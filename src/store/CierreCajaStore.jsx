import { create } from "zustand";
import {
  AperturarCierreCaja,
  InsertarIngresosalidaCaja,
  MostrarCierreCajaAperturada,
} from "../supabase/crudCierresCaja";

export const useCierreCajaStore = create((set) => ({
  stateIngresoSalida: false,
  setStateIngresoSalida: (state) => set({ stateIngresoSalida: !state }),
  stateCierreCaja: false,
  setStateCierreCaja: (state) => set({ stateCierreCaja: !state }),
  tipoRegistro: "",
  setTipoRegistro: (p) => set({ tipoRegistro: p }),
  dataCierreCaja: null,
  mostrarCierreCaja: async (p) => {
    const response = await MostrarCierreCajaAperturada(p);
    set({ dataCierreCaja: response });
    return response;
  },
  aperturarCaja: async (p) => {
    const response = await AperturarCierreCaja(p);
    set({ dataCierreCaja: response });
    return response;
  },
  insertarIngresoSalidaCaja: async (p) => {
    await InsertarIngresosalidaCaja(p);
  },
}));
