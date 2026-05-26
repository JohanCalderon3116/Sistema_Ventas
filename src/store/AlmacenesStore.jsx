import { create } from "zustand";
import {
  EditarAlmacenes,
  EliminarAlmacen,
  InsertarAlmacenes,
  MostrarAlmacenesXEmpresa,
  MostrarAlmacenesXSucursal,
  MostrarAlmacenXSucursal,
} from "../index";

export const useAlmacenesStore = create((set, get) => ({
  stateAlmacen: false,
  setStateAlmacen: (p) => set({ stateAlmacen: p }),
  accion: "",
  setAccion: (p) => set({ accion: p }),
  almacenSelelctItem: [],
  setAlmacenSelelctItem: (p) => set({ almacenSelelctItem: p }),
  dataalmacen: [],
  dataalmacenxsucursal: [],
  mostrarAlmacenXsucursal: async (p) => {
    const response = await MostrarAlmacenXSucursal(p);
    set({ dataalmacenxsucursal: response });
    const { dataalmacenxsucursal } = get();
    return dataalmacenxsucursal;
  },
  dataAlmacenesXEmpresa: null,
  mostrarAlmacenesXEmpresa: async (p) => {
    const response = await MostrarAlmacenesXEmpresa(p);
    set({ dataAlmacenesXEmpresa: response });
    return response;
  },
  dataAlmacenesXSucursa: null,
  mostrarAlmacenesXSucursal: async (p) => {
    const response = await MostrarAlmacenesXSucursal(p);
    set({ almacenSelelctItem: response[0] });
    set({ dataAlmacenesXSucursa: response });
    return response;
  },
  eliminarAlmacen: async (p) => {
    await EliminarAlmacen(p);
  },
  insertarAlmacenes: async (p) => {
    await InsertarAlmacenes(p);
  },
  editarAlmacenes: async (p) => {
    await EditarAlmacenes(p);
  },
}));
