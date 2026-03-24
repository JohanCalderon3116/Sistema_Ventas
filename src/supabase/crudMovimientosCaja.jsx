import Swal from "sweetalert2";
import { supabase } from "./supabase.config";

const tabla = "movimientos_caja";

export async function InsertarMovCaja(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops... InerstarMovCaja" + error.message,
      text: error.message,
    });
    return;
  }
}
