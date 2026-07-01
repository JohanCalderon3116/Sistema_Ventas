import { create } from "zustand";
import {
  AperturarCierreCaja,
  CerrarTurnoCaja,
  MostrarCierreajaPorEmpresa,
  MostrarCierreCajaAperturada,
  MostrarCierreCajaXUsuario,
} from "../supabase/crudCierresCaja";

export const useCierreCajaStore = create((set) => ({
  stateConteoCaja: false,
  setStateConteoCaja: (p) => set({ stateConteoCaja: p }),
  stateIngresoSalida: false,
  setStateIngresoSalida: (p) => set({ stateIngresoSalida: p }),
  stateCierreCaja: false,
  setStateCierreCaja: (p) => set({ stateCierreCaja: p }),
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
  cerrarTurnoCaja: async (p) => {
    await CerrarTurnoCaja(p);
  },
  mostrarCierreajaPorEmpresa: async (p) => {
    const response = await MostrarCierreajaPorEmpresa(p);
    return response;
  },
  cierreCjaItemSelect: null,
  setCierreCjaItemSelect: (p) => {
    set({ cierreCjaItemSelect: p });
  },
  mostrarCierreCajaXUsuario: async (p) => {
    const reponse = await MostrarCierreCajaXUsuario(p);
    set({ dataCierreCaja: reponse });
    return reponse;
  },
}));
