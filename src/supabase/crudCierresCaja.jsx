import Swal from "sweetalert2";
import { supabase } from "./supabase.config";

const tabla = "cierrecaja";
const tabla2 = "ingresos_salidas_caja";

export async function MostrarCierreCajaAperturada(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_caja", p.id_caja)
    .eq("estado", 0)
    .maybeSingle();
  return data;
}
export async function InsertarIngresosalidaCaja(p) {
  const { data, error } = await supabase.from(tabla2).insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops... Cierre caja",
      text: error.message,
    });
    return;
  }
  return data;
}
export async function AperturarCierreCaja(p) {
  const { data, error } = await supabase.from(tabla).insert(p).maybeSingle();
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops... Cierre caja",
      text: error.message,
    });
    return;
  }
  return data;
}
