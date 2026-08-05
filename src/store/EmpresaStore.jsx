import { create } from "zustand";
import {
  EditarEmpresa,
  EditarMonedaEmpresa,
  InsertarCategorias,
  InsertarEmpresa,
  MostrarEmpresaXIdUsuario,
} from "../index";

export const useEmpresaStore = create((set) => ({
  dataempresa: [],
  mostrarempresa: async (p) => {
    const response = await MostrarEmpresaXIdUsuario(p);
    set({ dataempresa: response });
    return response;
  },
  insertarEmpresa: async (p) => {
    const response = await InsertarEmpresa(p);
    console.log("respuesta de empresa", response);
  },
  editarEmpresa: async (p, fileold, filnew) => {
    await EditarEmpresa(p, fileold, filnew);
  },
  editarMondaEmpresa: async (p) => {
    await EditarMonedaEmpresa(p);
  },
}));
