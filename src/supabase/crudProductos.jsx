import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "productos";
export async function InsertarProductos(p) {
  const { error } = await supabase.rpc("insertarProductos", p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
}
export async function MostrarProductos(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa)
    .order("id", { ascending: false });
  return data;
}
export async function BuscarProductos(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa)
    .ilike("nombre", "%" + p.Productos + "%");
  return data;
}
export async function EliminarProductos(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
}
export async function EditarProductos(p) {
  const { error } = await supabase.rpc("editarProductos", p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
}
