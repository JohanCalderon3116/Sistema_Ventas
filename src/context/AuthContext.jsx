import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase.config";
import {
  InsertarAdmin,
  InsertarEmpresa,
  MostrarRolesXnombre,
  MostrarTipoDocumentos,
  MostrarUsuarios,
} from "../index";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (value, session) => {
      if (session?.user == null) {
        setUser(null);
      } else {
        setUser(session?.user);
      }
      insertarDatos(session?.user.id, session?.user.email);
    });
    return () => {
      data.subscription;
    };
  }, []);
  const insertarDatos = async (id_auth, correo) => {
    const response = await MostrarUsuarios({ id_auth: id_auth });
    if (response) {
      return;
    } else {
      await InsertarEmpresa({
        id_auth: id_auth,
        correo: correo,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
