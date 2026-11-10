import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/supabase.config";
import { MostrarUsuarios, useEmpresaStore } from "../index";
import { limpiarEstadoSesion } from "../store/AuthStore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { insertarEmpresa } = useEmpresaStore();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(undefined);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const prevUserIdRef = useRef(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const usuarioSesion = session?.user ?? null;
      const nuevoId = usuarioSesion?.id ?? null;

      if (
        event === "SIGNED_OUT" ||
        !nuevoId ||
        (prevUserIdRef.current && prevUserIdRef.current !== nuevoId)
      ) {
        limpiarEstadoSesion();
        queryClient.removeQueries({
          predicate: (query) => query.queryKey[0] !== "mostrar contraseña",
        });
      }

      prevUserIdRef.current = nuevoId;
      setUser(usuarioSesion);
      setIsCheckingAuth(false);

      if (usuarioSesion) {
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
  }, [queryClient]);

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
