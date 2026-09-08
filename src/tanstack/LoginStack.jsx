import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "sonner";
import { useContraseñaStore } from "../store/ContraseñaStore";

export const useIniciarSesionConEmailMutationStack = () => {
  const queryClient = useQueryClient();
  const { loginEmail } = useAuthStore();
  return useMutation({
    mutationKey: ["iniciar sesion con email"],
    mutationFn: loginEmail,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
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
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
