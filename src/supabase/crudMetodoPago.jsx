import { supabase } from "./supabase.config";

const table = "metodos_pago";
export async function MostrarMetodosPago(p) {
  const { data } = await supabase
    .from(table)
    .select()
    .eq("id_empresa", p.id_empresa);
  return data;
}
