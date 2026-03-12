import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "empresa";
export async function InsertarEmpresa(p) {
  const { data, error } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Oops...",
    //   text: error.message,
    // });
    return;
  }
  return data;
}

export async function MostrarEmpresaXidusuario(p) {
  const { data, error } = await supabase
    .rpc("mostrarempresaxiduser", p)
    .maybeSingle();
  // if (error) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: error.message,
  //   });
  //   return;
  // }
  return data;
}
