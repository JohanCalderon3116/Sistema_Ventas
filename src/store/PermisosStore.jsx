import { create } from "zustand";
import {
  EliminarPermisos,
  InsertarPermisos,
  MostrarPermisos,
  MostrarPermisosConfiguraciones,
  MostrarPermisosDefault,
  MostrarPermisosGlobales,
} from "../supabase/crudPermisos";

export const usePermisosStore = create((set, get) => ({
  dataPermisos: [],
  selectModules: [],
  setSelectModules: (p) => set({ selectModules: p }),
  toggleModule: (moduleId) => {
    const { selectModules } = get();
    const updateModules = selectModules.includes(moduleId)
      ? selectModules.filter((id) => id !== moduleId)
      : [...selectModules, moduleId];
    set({ selectModules: updateModules });
  },
  mostrarPermisos: async (p) => {
    const response = await MostrarPermisos(p);
    set({ dataPermisos: response });
    return response;
  },
  mostrarPermisosDefault: async () => {
    const response = await MostrarPermisosDefault();
    return response;
  },
  eliminarPermisos: async (p) => {
    await EliminarPermisos(p);
  },
  actualizarPermisos: async (p) => {
    // await EliminarPermisos(p);
    // await InsertarPermisos(p);
  },
  dataPermisosGlobales: [],
  mostrarPermisosGlobales: async (p) => {
    const response = await MostrarPermisosGlobales(p);
    console.log("respuesta cruda supabase:", JSON.stringify(response[0]));
    set({ dataPermisosGlobales: response });
    return response;
  },
  dataPermisosConfiguraciones: [],
  mostrarPermisosConfiguraciones: async (p) => {
    const response = await MostrarPermisosConfiguraciones(p);
    set({ dataPermisosConfiguraciones: response });
    return response;
  },
}));
