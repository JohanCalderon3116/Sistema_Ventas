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
      // console.log("value", value);
      // console.log("session", session);
      // console.log("session", session.user.id);
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
      const responseEmpresa = await InsertarEmpresa({
        id_auth: id_auth,
      });
      const responseTipoDoc = await MostrarTipoDocumentos({
        id_empresa: responseEmpresa?.id,
      });
      console.log(responseTipoDoc);
      const responseRol = await MostrarRolesXnombre({
        nombre: "SuperAdmin",
      });
      const pUser = {
        id_tipodocumento: responseTipoDoc[0]?.id,
        id_rol: responseRol?.id,
        correo: correo,
        fecharegistro: new Date(),
        id_auth: id_auth,
      };
      await InsertarAdmin(pUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
