import { supabase } from "./supabase.config";
const tabla = "tipodocumento";

export async function MostrarTipoDocumentos(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
