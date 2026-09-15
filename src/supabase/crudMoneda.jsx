import { supabase } from "./supabase.config";
const table = "moneda";
export async function MostrarMoneda() {
  const { data, error } = await supabase.from(table).select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
