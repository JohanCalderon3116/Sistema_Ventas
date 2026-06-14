import { create } from "zustand";
import {
  EditarUsuario,
  EliminarUsuariosAsignados,
  InsertarAsignacionCajaSucursal,
  InsertarCreadencialesUser,
  InsertarPermisos,
  InsertarUsuarios,
  MostrarUsuarios,
  ObtenerIdAuthSupabase,
  usePermisosStore,
} from "../index";

export const useUsuariosStore = create((set) => ({
  refetchs: null,
  datausuarios: [],
  mostrarusuarios: async () => {
    const idauth = await ObtenerIdAuthSupabase();
    const response = await MostrarUsuarios({ id_auth: idauth });
    set({ datausuarios: response });
    return response;
  },
  insertarUsuarios: async (p) => {
    const selectModules = usePermisosStore.getState().selectModules || [];
    const data = await InsertarCreadencialesUser({
      email: p.email,
      pass: p.pass,
    });
    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      nro_doc: p.nro_doc,
      telefono: p.telefono,
      id_rol: p.id_rol,
      correo: p.email,
      id_auth: data,
    });
    await InsertarAsignacionCajaSucursal({
      id_sucursal: p.id_sucursal,
      id_usuario: dataUserNew?.id,
      id_caja: p.id_caja,
    });
    if (Array.isArray(selectModules) && selectModules.length > 0) {
      selectModules.forEach(async (idModule) => {
        let p = {
          id_usuario: dataUserNew?.id,
          id_modulo: idModule,
        };
        await InsertarPermisos(p);
      });
    } else {
      throw new Error("No hay módulos seleccionados");
    }
  },
  eliminarUsuariosAsignados: async (p) => {
    await EliminarUsuariosAsignados(p);
  },
  editarUsuario: async (p) => {
    await EditarUsuario(p);
  },
}));
