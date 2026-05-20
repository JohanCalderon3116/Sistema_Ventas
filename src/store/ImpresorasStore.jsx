import { create } from "zustand";
import {
  EditarImpresoras,
  MostrarImpresorasXCaja,
} from "../supabase/crudImpresoras";
const fetchWithTimeOut = (url, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), timeout);
    fetch(url)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};
export const useImpresorasStore = create((set, get) => ({
  dataImpresorasXCaja: null,
  selectImpresora: {
    name: "Seleccione una impresora",
  },
  setSelectImpresora: (p) => {
    set({ selectImpresora: p });
  },
  statePrintDirecto: false,
  setStatePrintDirecto: () => {
    set((state) => ({ statePrintDirecto: !state.statePrintDirecto }));
  },
  mostrarDatosPc: async () => {
    try {
      const response = await fetchWithTimeOut(
        "http://localhost:5076/api/get-local-ip",
        5000,
      );
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  },
  mostrarListaImpresoras: async () => {
    const response = await fetch("http://localhost:5076/api/List");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    return data;
  },
  editarImpresoras: async (p) => {
    await EditarImpresoras(p);
  },
  mostrarImpresorasXCaja: async (p) => {
    const response = await MostrarImpresorasXCaja(p);
    set(() => ({
      dataImpresorasXCaja: response,
      statePrintDirecto: response?.state,
      selectImpresora:
        response?.name === "-"
          ? {
              name: "Seleccione una impresora",
            }
          : response,
    }));
    return response;
  },
}));
