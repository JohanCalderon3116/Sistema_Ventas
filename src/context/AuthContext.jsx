import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase.config";
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
      console.log("value", value)
      console.log("session", session)
    });
    return () => {
      data.subscription;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
