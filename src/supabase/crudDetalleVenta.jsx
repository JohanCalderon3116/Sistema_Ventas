import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "detalle_venta";
export async function InsertarDetalleVentas(p) {
  const { error } = await supabase
    .from(tabla)
    .insert(p)
    .select()
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
}
// export async function MostrarProductos(p) {
//   const { data } = await supabase.rpc("mostrarproductos", {
//     _id_empresa: p.id_empresa,
//   });
//   return data;
// }
// export async function BuscarProductos(p) {
//   const { data } = await supabase.rpc("buscarproductos", {
//     _id_empresa: p.id_empresa,
//     buscador: p.buscador,
//   });
//   return data;
// }
// export async function EliminarVentasIncompletas(p) {
//   const { error } = await supabase
//     .from(tabla)
//     .delete()
//     .eq("estado", "nueva")
//     .eq("id_usuario", p.id_usuario);
//   if (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: error.message,
//     });
//     return;
//   }
// }
// export async function EditarProductos(p) {
//   const { error } = await supabase.rpc("editarproductos", p);
//   if (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: error.message,
//     });
//     return;
//   }
// }
