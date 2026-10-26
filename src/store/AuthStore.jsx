import { create } from "zustand";
import { ObtenerIdAuthSupabase, supabase } from "../index";

// Tiempo que se deja a la pantalla de carga para aparecer (fade-in) antes de
// cerrar la sesión, así la UI protegida nunca se desmonta a la vista del usuario.
const DURACION_TRANSICION_SALIDA_MS = 250;

export const useAuthStore = create((set) => ({
  isSigningOut: false,
  loginGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  },
  cerrarSesion: async () => {
    set({ isSigningOut: true });
    await new Promise((resolve) =>
      setTimeout(resolve, DURACION_TRANSICION_SALIDA_MS),
    );
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // La sesión sigue activa: se revierte la transición.
          console.error("Error al cerrar sesión:", error.message);
          set({ isSigningOut: false });
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      set({ isSigningOut: false });
      return false;
    }
  },
  finalizarCierreSesion: () => {
    set({ isSigningOut: false });
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
  crearUserYLogin: async (p) => {
    const { data } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
    });
    return data.user;
  },
  obtenerIdAuthSupabase: async () => {
    const response = await ObtenerIdAuthSupabase();
    return response;
  },
}));
