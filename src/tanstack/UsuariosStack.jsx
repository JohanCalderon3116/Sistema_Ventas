import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

export const useEditarUsuarioMutationStack = () => {
    const queryClient = useQueryClient()
  const { editarUsuario, datausuarios } = useUsuariosStore();
  return useMutation({
    mutationKey: ["editar perfil usuario"],
    mutationFn: async (data) => {
      const p = {
        id: datausuarios?.id,
        nombres: data?.nombres,
        nro_doc: data?.nro_doc,
        telefono: data?.telefono,
      };
      await editarUsuario(p);
    },
    onError: (error) => {
      toast.error(
        `Lo sentimos, no pudimos actualizar tu empresa :/ ${error.message}`,
      );
    },
    onSuccess: () => {
      toast.success("Datos guardados, tu perfil se actualizo con exito :p");
      queryClient.invalidateQueries(["mostrar usuarios"])
    },
  });
};
