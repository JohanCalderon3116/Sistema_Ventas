import { supabase } from "./supabase.config";
const tabla = "permisos";
const tablaDefault = "permisos_default";
export async function MostrarPermisos(p) {
  const { data } = await supabase
    .from(tabla)
    .select(`*, modulos(*)`)
    .eq("id_usuario", p.id_usuario);
  return data;
}
export async function MostrarPermisosDefault() {
  const { data } = await supabase.from(tablaDefault).select();
  return data;
}
export async function InsertarPermisos(p) {
  const { error } = await supabase.from(tabla).insert(p).select();
  if (error) {
    throw new Error(`Error al insertar permiso ${error.message}`);
  }
}
export async function EliminarPermisos(p) {
  const { error } = await supabase
    .from(tabla)
    .delete()
    .eq("id_usuario", p.id_usuario);
  if (error) {
    throw new Error(error.message);
  }
}
