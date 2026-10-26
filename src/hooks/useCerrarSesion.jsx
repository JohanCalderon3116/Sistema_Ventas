import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

/**
 * Cierra la sesión y lleva al Login usando el enrutador del cliente
 * (sin recargas del navegador). La pantalla de carga oscura se muestra
 * mientras dura la transición gracias a `isSigningOut` del AuthStore.
 */
export const useCerrarSesion = () => {
  const navigate = useNavigate();
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);
  return useCallback(async () => {
    const ok = await cerrarSesion();
    if (ok) {
      navigate("/login", { replace: true });
    }
  }, [cerrarSesion, navigate]);
};
