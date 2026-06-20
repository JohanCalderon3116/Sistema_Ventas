import { supabase } from "./supabase.config";

const table = "creditos";
export async function InsertarCredito(p) {
  const { data, error } = await supabase.from(table).insert([p]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function MostrarCreditos(p) {
  const { data, error } = await supabase
    .from(table)
    .select(
      `
      *,
      clientes_proveedores!inner (
        nombres,
        tipo,
        id_empresa
      )
    `,
    )
    .eq("clientes_proveedores.tipo", "cliente")
    .eq("clientes_proveedores.id_empresa", p.id_empresa);

  if (error) {
    throw new Error(error.message);
  }
  return data.map((item) => ({
    ...item,
    nombres: item.clientes_proveedores?.nombres || "Sin nombre",
  }));
}

export async function BuscarCreditos(p) {
  const { data, error } = await supabase
    .from(table)
    .select(
      `
      *,
      clientes_proveedores!inner (
        nombres,
        tipo,
        id_empresa
      )
    `,
    )
    .eq("clientes_proveedores.tipo", "cliente")
    .eq("clientes_proveedores.id_empresa", p.id_empresa)
    .ilike("clientes_proveedores.nombres", "%" + p.nombres + "%");

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    ...item,
    nombres: item.clientes_proveedores?.nombres || "Sin nombre",
  }));
}
