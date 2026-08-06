import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";

export const useEditarUsuarioMutationStack = () => {
  const queryClient = useQueryClient();
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
      toast.error(`Aish, algo falló actualizando tu perfil 😩`);
    },
    onSuccess: () => {
      toast.success("¡Perfil actualizado sin problema! 😎");
      queryClient.invalidateQueries(["mostrar usuarios"]);
    },
  });
};
export const useMostrarUsuariosAsignadosQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarUsariosAsignados } = useAsignacionCajaSucursalesStore();
  return useQuery({
    queryKey: ["mostrar usuarios asignados", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarUsariosAsignados({
        _id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
};
export const useBuscarUsuariosAsignados = () => {
  const { dataempresa } = useEmpresaStore();
  const { buscarUsariosAsignados, buscador } =
    useAsignacionCajaSucursalesStore();
  return useQuery({
    queryKey: [
      "buscar usuarios asignados",
      { id_empresa: dataempresa?.id, buscador: buscador },
    ],
    queryFn: () =>
      buscarUsariosAsignados({
        _id_empresa: dataempresa?.id,
        buscador: buscador,
      }),
    enabled: !!dataempresa,
  });
};
