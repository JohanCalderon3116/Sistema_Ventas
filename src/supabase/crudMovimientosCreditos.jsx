import { supabase } from "./supabase.config";
const table = "movimientos_credito";
export async function InsertarMovimientosCreditos(p) {
  const { data, error } = await supabase.from(table).insert(p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
