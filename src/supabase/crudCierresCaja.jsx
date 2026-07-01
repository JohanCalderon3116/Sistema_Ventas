import Swal from "sweetalert2";
import { supabase } from "./supabase.config";

const tabla = "cierrecaja";
export async function MostrarCierreCajaAperturada(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_caja", p.id_caja)
    .eq("estado", 0)
    .maybeSingle();
  return data;
}
export async function AperturarCierreCaja(p) {
  const { data, error } = await supabase
    .from(tabla)
    .insert(p)
    .select(`*, caja(*,sucursales(*))`)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function CerrarTurnoCaja(p) {
  const { data, error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function MostrarCierreajaPorEmpresa(p) {
  const { data, error } = await supabase.rpc(
    "mostrarcajasabiertasporempresa",
    p,
  );
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function MostrarCierreCajaXUsuario(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, caja(*,sucursales(*))`)
    .eq("id_usuario", p.id_usuario)
    .eq("estado", 0)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
