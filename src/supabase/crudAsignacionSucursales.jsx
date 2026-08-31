import { supabase } from "./supabase.config";
const tabla = "asignacion_sucursal";

export async function MostrarSucursalCajaAsignada(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, sucursales(*), caja(*)`)
    .eq("id_usuario", p.id_usuario);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function InsertarAsignacionCajaSucursal(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarUsuariosAsignados(p) {
  const { data, error } = await supabase.rpc("mostrarusuariosasignados", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function BuscarUsuariosAsignados(p) {
  const { data, error } = await supabase.rpc("buscarusuariosasignados", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function InsertarAsignacionSucusal(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
