import { supabase } from "./supabase.config";
const table = "serealizacion_comprobantes";
export async function MostrarSerealizaciones(p) {
  const { data, error } = await supabase
    .from(table)
    .select(`*,tipo_comprobantes!inner(nombre)`)
    .eq("sucursal_id", p.sucursal_id)
    .order("id", { ascending: true });
  if (error) {
    throw Error(error.message);
  }
  return data;
}

export async function EditarSerealizacionDefault(p) {
  const { error } = await supabase.rpc("setdefaultserializacion", p);
  if (error) {
    throw new Error(error.message);
  }
}

export async function EditarSerealizacion(p) {
  const { error } = await supabase.from(table).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
