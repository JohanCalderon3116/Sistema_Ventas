import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { limpiarEstadoSesion, useAuthStore } from "../store/AuthStore";

export const useCerrarSesion = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);

  return useCallback(async () => {
    const ok = await cerrarSesion();
    if (ok) {
      limpiarEstadoSesion();
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "mostrar contraseña",
      });
      navigate("/login", { replace: true });
    }
  }, [cerrarSesion, navigate, queryClient]);
};
