import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "sonner";
import { useContraseñaStore } from "../store/ContraseñaStore";

export const useIniciarSesionConEmailMutationStack = () => {
  const { loginEmail } = useAuthStore();
  return useMutation({
    mutationKey: ["iniciar sesion con email"],
    mutationFn: loginEmail,
    onError: (error) => {
      toast.error(`Error al iniciar sesión: ${error.message}`);
    },
  });
};
export const useMostrarContraseñaQueryStack = () => {
  const { mostrarContraseña } = useContraseñaStore();
  return useQuery({
    queryKey: ["mostrar contraseña"],
    queryFn: mostrarContraseña,
  });
};
