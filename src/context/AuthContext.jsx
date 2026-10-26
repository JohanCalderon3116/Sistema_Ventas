import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase.config";
import {
  MostrarUsuarios,
  useEmpresaStore,
} from "../index";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { insertarEmpresa } = useEmpresaStore();
  const [user, setUser] = useState(undefined);
  // true hasta que Supabase confirme el estado real de la sesión (INITIAL_SESSION)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((value, session) => {
      const usuarioSesion = session?.user ?? null;
      setUser(usuarioSesion);
      setIsCheckingAuth(false);
      if (usuarioSesion) {
        // Se difiere la llamada para no ejecutar consultas de Supabase dentro
        // del callback de onAuthStateChange (recomendación oficial: evita bloqueos).
        setTimeout(() => {
          insertarDatos(usuarioSesion.id, usuarioSesion.email).catch((error) =>
            console.error(error),
          );
        }, 0);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  const insertarDatos = async (id_auth, correo) => {
    const response = await MostrarUsuarios({ id_auth: id_auth });
    if (response) {
      return;
    } else {
      await insertarEmpresa({
        id_auth: id_auth,
        correo: correo,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
