import { supabase } from "./supabase.config";
const tabla = "usuarios";
export async function MostrarUsuarios(p) {
  const { data } = await supabase
    .from(tabla)
    .select(`*, roles(*)`)
    .eq("id_auth", p.id_auth)
    .maybeSingle();
  return data;
}
export async function InsertarAdmin(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function InsertarUsuarios(p) {
  const { error, data } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function EditarUsuario(p) {
  const { error, data } = await supabase
    .from(tabla)
    .update(p)
    .select()
    .eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function InsertarCreadencialesUser(p) {
  const { data, error } = await supabase.rpc("crearcredencialesuser", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function ObtenerIdAuthSupabase() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session != null) {
    const { user } = session;
    const idauth = user.id;
    return idauth;
  }
}
export async function EliminarUsuariosAsignados(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
