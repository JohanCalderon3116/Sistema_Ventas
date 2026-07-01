import { supabase } from "./supabase.config";

const tabla = "caja";
export async function MostrarCajaXSucursal(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal);
  return data;
}

export async function InsertarCaja(p) {
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
export async function EditarCaja(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EliminarCaja(p) {
  const { error: errorAsignacion } = await supabase
    .from("asignacion_sucursal")
    .delete()
    .eq("id_caja", p.id);
  if (errorAsignacion) {
    throw new Error(errorAsignacion.message);
  }

  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
