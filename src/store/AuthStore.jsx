import { create } from "zustand";
import { MostrarUsuarios, supabase } from "../index";

export const useAuthStore = create((set) => ({
  loginGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  },
  cerrarSesion: async () => {
    await supabase.auth.signOut();
  },
  loginEmail: async (p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    });
    if (error) {
      if (error.status === 400) {
        throw new Error("Correo y ontraseña no son validos");
      } else {
        throw new Error("Error al iniciar sesión: ", error.message);
      }
    }
    return data.user;
  },
}));
