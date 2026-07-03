import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
const tabla = "detalle_venta";
export async function InsertarDetalleVentas(p) {
  const { error } = await supabase.rpc("insertardetalleventa", p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarDetalleVenta(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_venta", p.id_venta)
    .order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function EliminarDetalleVentas(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
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

export async function ContarVentasXEmpresa(p) {
  const { data, error } = await supabase.rpc("contarventasempresa", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function SumarTotalVentasXEmpresa(p) {
  const { data, error } = await supabase.rpc("sumartotalventasempresa", p);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export async function CalcularGananciasXEmpresa(p) {
  const { data, error } = await supabase.rpc("calcularganallasempresa", p);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}
export async function MostrarVentasAgrupadasFecha(p) {
  const { data, error } = await supabase.rpc("mostrarventasagrupadasfecha", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function EditarCantidadDetalleVenta(p) {
  const { data, error } = await supabase.rpc("editarcantidaddv", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
