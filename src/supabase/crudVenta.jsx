import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "ventas";
export async function InsertarVentas(p) {
  const { error, data } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
    return;
  }
  return data;
}
export async function MostrarVentasXsucursal(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal)
    .eq("estado", "nueva")
    .maybeSingle();
  return data;
}
// export async function BuscarProductos(p) {
//   const { data } = await supabase.rpc("buscarproductos", {
//     _id_empresa: p.id_empresa,
//     buscador: p.buscador,
//   });
//   return data;
// }
export async function EliminarVentasIncompletas(p) {
  const { error } = await supabase
    .from(tabla)
    .delete()
    .eq("estado", "nueva")
    .eq("id_usuario", p.id_usuario);
  if (error) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Oops...",
    //   text: error.message,
    // });
    return;
  }
}
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

export async function ConfirmarVenta(p) {
  const { data, error } = await supabase
    .from(tabla)
    .update(p)
    .eq("id", p.id)
    .select();
  return data;
  if (error) {
    throw new Error(error.message);
  }
}

export async function EliminarVenta(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
