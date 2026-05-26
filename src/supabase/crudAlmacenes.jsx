import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "almacenes";

export async function MostrarAlmacenXSucursal(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal)
    .maybeSingle();

  return data;
}
export async function MostrarAlmacenesXEmpresa(p) {
  const { data } = await supabase
    .from("sucursales")
    .select(`*, almacenes(*)`)
    .eq("id_empresa", p.id_empresa);
  return data;
}
export async function MostrarAlmacenesXSucursal(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal);
  return data;
}

export async function EliminarAlmacen(p) {
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
export async function InsertarAlmacenes(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
    return;
  }
}
export async function EditarAlmacenes(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
