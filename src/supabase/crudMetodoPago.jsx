import { supabase } from "./supabase.config";

const table = "metodos_pago";
export async function MostrarMetodosPago(p) {
  const { data } = await supabase
    .from(table)
    .select()
    .eq("id_empresa", p.id_empresa);
  return data;
}

export async function InsertarMetodosPago(p, file) {
  const { error, data } = await supabase
    .from(table)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  const img = file.size;
  if (img != undefined) {
    const nuevo_id = data?.id;
    const urlImagen = await subirImagen(nuevo_id, file);
    const piconoeditar = {
      icono: urlImagen.publicUrl,
      id: nuevo_id,
    };
    await EditarIconoMetodosPago(piconoeditar);
  }
}

async function subirImagen(idmetodopago, file) {
  const ruta = "metodospago/" + idmetodopago;
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

async function EditarIconoMetodosPago(p) {
  const { error } = await supabase.from(table).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EditarIconoStorage(id, file) {
  const ruta = "metodospago/" + id;
  await supabase.storage.from("imagenes").update(ruta, file, {
    cacheControl: "0",
    upsert: true,
  });
}

export async function EditarMetodosPago(p, fileold, filenew) {
  const { error } = await supabase.from(table).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (filenew != "-" && filenew.size != undefined) {
    if (fileold != "-") {

      await EditarIconoStorage(p.id, filenew);


      const ruta = "metodospago/" + p.id;
      const { data: urlImagen } = supabase.storage
        .from("imagenes")
        .getPublicUrl(ruta);

      const piconoeditar = {
        icono: `${urlImagen.publicUrl}?t=${Date.now()}`, 
        id: p.id,
      };
      await EditarIconoMetodosPago(piconoeditar);
    } else {
      const dataImagen = await subirImagen(p.id, filenew);
      const piconoeditar = {
        icono: `${dataImagen.publicUrl}?t=${Date.now()}`, 
        id: p.id,
      };
      await EditarIconoMetodosPago(piconoeditar);
    }
  }
}

export async function EliminarMetodosPago(p) {
  const { error } = await supabase.from(table).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (p.icono != "-") {
    const ruta = "metodospago/" + p.id;
    await supabase.storage.from("imagenes").remove([ruta]);
  }
}
