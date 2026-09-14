import { supabase } from "./supabase.config";
const table = "movimientos_credito";

export async function InsertarMovimientosCreditos(p) {
  const { error } = await supabase.from(table).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function ObtenerMovimientosCreditoPorCredito(p) {
  const { data, error } = await supabase
    .from(table)
    .select(
      "id, id_credito, id_venta, tipo_movimiento, valor, observacion, fecha_movimiento",
    )
    .eq("id_credito", p)
    .order("fecha_movimiento", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
