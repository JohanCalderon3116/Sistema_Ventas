import { supabase } from "./supabase.config";

const tabla = "stock";
export async function InsertarStock(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarStockAlmacenYProduct(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_almacen", p.id_almacen)
    .eq("id_producto", p.id_producto)
    .maybeSingle();
  return data;
  if (error) {
    throw new Error(error.message);
  }
}

export async function MostrarStockAlmacenesYProducto(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, almacenes(*)`)
    .eq("id_almacen", p.id_almacen)
    .eq("id_producto", p.id_producto)
    .gt("stock", 0);
  return data;
  if (error) {
    throw new Error(error.message);
  }
}
export async function EditarStock(p, tipo) {
  const { error } = await supabase.rpc(
    tipo === "ingreso" ? "incrementarstock" : "reducirstock",
    p,
  );
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarAlertasStockXVenta(p) {
  const { error, data } = await supabase.rpc("mostraralertasstockxventa", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
