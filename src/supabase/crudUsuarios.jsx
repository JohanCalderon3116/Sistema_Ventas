import { supabase } from "./supabase.config";
const tabla = "usuarios";

export async function MostrarUsuarios(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, roles(*)`)
    .eq("id_auth", p.id_auth)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function InsertarAdmin(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function InsertarUsuarios(p) {
  const { error, data } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function EditarUsuario(p, fileold, filenew) {
  const { error, data } = await supabase
    .from(tabla)
    .update(p)
    .select()
    .eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (filenew?.size != undefined) {
    let publicUrlBase;
    if (fileold != "-") {
      await EditarIconoStorageUsuario(p.id, filenew);
      publicUrlBase = await obtenerUrlPublicaUsuarios(p.id);
    } else {
      const dataImagen = await subirImagenUsuario(p.id, filenew);
      publicUrlBase = dataImagen.publicUrl;
    }
    const plogoeditar = {
      logo: `${publicUrlBase}?t=${Date.now()}`,
      id: p.id,
    };
    await EditarLogoUsuario(plogoeditar);
  }
  return data;
}
export async function InsertarCreadencialesUser(p) {
  const { data, error } = await supabase.rpc("crearcredencialesuser", p);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function ObtenerIdAuthSupabase() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session != null) {
    const { user } = session;
    const idauth = user.id;
    return idauth;
  }
}
export async function EliminarUsuariosAsignados(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EditarIconoStorageUsuario(id, file) {
  const ruta = "usuarios/" + id;
  await supabase.storage.from("imagenes").update(ruta, file, {
    cacheControl: "0",
    upsert: true,
  });
}
async function obtenerUrlPublicaUsuarios(idempresa) {
  const ruta = "usuarios/" + idempresa;
  const { data } = await supabase.storage.from("imagenes").getPublicUrl(ruta);
  return data.publicUrl;
}
async function subirImagenUsuario(idempresa, file) {
  const ruta = "usuarios/" + idempresa;
  const { data, error } = await supabase.storage
    .from("imagenes")
    .upload(ruta, file, {
      cacheControl: "0",
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    const { data: urlimagen } = await supabase.storage
      .from("imagenes")
      .getPublicUrl(ruta);
    return urlimagen;
  }
}
export async function EditarLogoUsuario(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
