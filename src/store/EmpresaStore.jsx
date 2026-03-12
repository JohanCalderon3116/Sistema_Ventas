import { create } from "zustand";
import {
  InsertarCategorias,
  InsertarEmpresa,
  MostrarEmpresaXidusuario,
} from "../index";

export const useEmpresaStore = create((set) => ({
  dataempresa: [],
  mostrarempresa: async (p) => {
    const response = await MostrarEmpresaXidusuario(p);
    set({ dataempresa: response });
    return response;
  },
  InsertarEmpresa: async (p) => {
    const response = await InsertarEmpresa(p);
    console.log("respuesta de empresa", response);
  },
}));
