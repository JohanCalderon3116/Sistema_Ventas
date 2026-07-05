import { create } from "zustand";
import {
  BuscarProductos,
  EditarProductos,
  MostrarProductos,
  EliminarProductos,
  InsertarProductos,
  GenerarCodigo,
} from "../index";

export const useProductosStore = create((set, get) => ({
  refetchs: null,
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  dataProductos: [],
  ProductosItemSelect: [],
  parametros: {},
  resultadosBusqueda: [],
  mostrarProductos: async (p) => {
    const response = await MostrarProductos(p);
    set({ parametros: p });
    set({ dataProductos: response });
    set({ ProductosItemSelect: response[0] });
    set({ refetchs: p.refetchs });
    return response;
  },
  selectProductos: (p) => {
    set({ ProductosItemSelect: p });
  },
  insertarProductos: async (p) => {
    const response = await InsertarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    set(mostrarProductos(parametros));
    return response;
  },
  eliminarProductos: async (p) => {
    await EliminarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    set(mostrarProductos(parametros));
  },
  editarProductos: async (p) => {
    await EditarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    set(mostrarProductos(parametros));
  },
  buscarProductos: async (p) => {
    const response = await BuscarProductos(p);
    set({ resultadosBusqueda: response });
    return response;
  },
  codigogenerado: 0,
  generarCodigo: () => {
    const response = GenerarCodigo({ id: 2 });
    set({ codigogenerado: response });
  },
}));
