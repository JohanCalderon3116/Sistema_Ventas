import { useEffect } from "react";
import { LoginTemplate } from "../index";
import { useAuthStore } from "../store/AuthStore";

export const Login = () => {
  const finalizarCierreSesion = useAuthStore(
    (state) => state.finalizarCierreSesion,
  );
  // Al montarse el Login (fondo oscuro) se retira la pantalla de carga del cierre de sesión.
  useEffect(() => {
    finalizarCierreSesion();
  }, [finalizarCierreSesion]);
  return <LoginTemplate></LoginTemplate>;
};
