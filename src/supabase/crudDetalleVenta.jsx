import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "detalle_venta";
export async function InsertarDetalleVentas(p) {
  const { error } = await supabase.rpc("insertardetalleventa", p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
}
export async function MostrarDetalleVenta(p) {
  const { data, error } = await supabase.rpc("mostrardetalleventa", {
    _id_venta: p.id_venta,
  });
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
  return data;
}
// export async function BuscarProductos(p) {
//   const { data } = await supabase.rpc("buscarproductos", {
//     _id_empresa: p.id_empresa,
//     buscador: p.buscador,
//   });
//   return data;
// }
export async function EliminarDetalleVentas(p) {
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

export async function MostrarTop5ProductosMasVenidosPorCantidad(p) {
  const { data } = await supabase.rpc(
    "mostrartop5productosmasvenidosporcantidad",
    p,
  );
  return data;
}

export async function MostrarTop10ProductosMasVenidosPorMonto(p) {
  const { data } = await supabase.rpc(
    "mostrartop10productosmasvenidospormonto",
    p,
  );
  return data;
}
