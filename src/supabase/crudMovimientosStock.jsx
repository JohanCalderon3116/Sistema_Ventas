import { supabase } from "./supabase.config";
const table = "movimientos_stock";

export async function InsertarMovStock(p) {
  const { error } = await supabase.from(table).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarMovStock(p) {
  const { data, error } = await supabase
    .from(table)
    .select(
      `
      *, 
      almacenes!inner(
        *, 
        sucursales!inner(*)
      ),
      productos(nombre)
    `,
    )
    .eq("almacenes.sucursales.id_empresa", p.id_empresa)
    .eq("id_producto", p.id_producto)
    .order("fecha", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function MostrarTotalInventario(p) {
  const { data, error } = await supabase.rpc("mostrar_inversion_inventario", p);
  if (error) {
    throw new Error(error.message);
  }
  return data?.[0] ?? null;
}
