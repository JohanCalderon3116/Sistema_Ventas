import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "modulos";
export async function MostrarModulos() {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .neq("etiquetas", "#default");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
