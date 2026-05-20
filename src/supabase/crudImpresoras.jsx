import { supabase } from "./supabase.config";
const tabla = "impresoras";
export async function EditarImpresoras(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(`Error al editar la impresora... ${error.message}`);
  }
}
export async function MostrarImpresorasXCaja(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_caja", p.id_caja)
    .maybeSingle();
  return data;
}
