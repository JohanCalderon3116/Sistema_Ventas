import { supabase } from "./supabase.config";
const tabla = "categorias";

export async function InsertarCategorias(p, file) {
  const { error, data } = await supabase.rpc("insertarcategorias", p);
  if (error) {
    throw new Error(error.message);
  }
  const img = file.size;
  if (img != undefined) {
    const nuevo_id = data;
    const urlImagen = await subirImagen(nuevo_id, file);
    const piconoeditar = {
      icono: urlImagen.publicUrl,
      id: nuevo_id,
    };
    await EditarIconoCategorias(piconoeditar);
  }
}
async function subirImagen(idcategoria, file) {
  const ruta = "categorias/" + idcategoria;
  const { data, error } = await supabase.storage
    .from("imagenes")
    .update(ruta, file, {
      cacheControl: "0",
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    const { data: urlImagen } = supabase.storage
      .from("imagenes")
      .getPublicUrl(ruta);
    return urlImagen;
  }
}
async function EditarIconoCategorias(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarCategorias(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa)
    .order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function BuscarCategorias(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa)
    .ilike("nombre", "%" + p.descripcion + "%");
  return data;
}
export async function EliminarCategorias(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (p.icono != "-") {
    const ruta = "categorias/" + p.id;
    await supabase.storage.from("imagenes").remove([ruta]);
  }
}
export async function EditarCategorias(p, fileold, filenew) {
  const { error } = await supabase.rpc("editarcategorias", p);
  if (error) {
    throw new Error(error.message);
  }
  if (filenew != "-" && filenew.size != undefined) {
    if (fileold != "-") {
      await EditarIconoStorage(p._id, filenew);

      const ruta = "categorias/" + p._id;
      const { data: urlImagen } = supabase.storage
        .from("imagenes")
        .getPublicUrl(ruta);

      const piconoeditar = {
        icono: `${urlImagen.publicUrl}?t=${Date.now()}`,
        id: p._id, 
      };
      await EditarIconoCategorias(piconoeditar);
    } else {
      const dataImagen = await subirImagen(p._id, filenew);
      const piconoeditar = {
        icono: `${dataImagen.publicUrl}?t=${Date.now()}`,
        id: p._id,
      };
      await EditarIconoCategorias(piconoeditar);
    }
  }
}
export async function EditarIconoStorage(id, file) {
  const ruta = "categorias/" + id;
  await supabase.storage.from("imagenes").update(ruta, file, {
    cacheControl: "0",
    upsert: true,
  });
}
