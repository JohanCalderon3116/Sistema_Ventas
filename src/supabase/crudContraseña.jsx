import { supabase } from "./supabase.config";
const table = "contraseña";
export async function MostrarContraseña() {
  const { data, error } = await supabase.from(table).select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
