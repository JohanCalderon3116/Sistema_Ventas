import { supabase } from "./supabase.config";
const tabla = "roles";

export async function MostrarRoles(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .neq("nombre", "superadmin");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
