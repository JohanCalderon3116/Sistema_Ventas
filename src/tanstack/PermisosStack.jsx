import { useQuery } from "@tanstack/react-query";
import { usePermisosStore } from "../store/PermisosStore";
import { useUsuariosStore } from "../store/UsuariosStore";

export const useMostrarPermisosConfiguracionesQueryStack = () => {
  const { datausuarios } = useUsuariosStore();
  const { mostrarPermisosConfiguraciones } = usePermisosStore();
  return useQuery({
    queryKey: ["mostrar permisos configuracion"],
    queryFn: () =>
      mostrarPermisosConfiguraciones({
        id_usuario: datausuarios?.id,
      }),
    enabled: !!datausuarios,
    staleTime: 1000 * 60 * 5,
  });
};
export const useMostrarPermisosGlobalesQueryStack = () => {
  const { datausuarios } = useUsuariosStore();
  const { mostrarPermisosGlobales } = usePermisosStore();
  return useQuery({
    queryKey: ["permisos globales", datausuarios?.id],
    queryFn: () => mostrarPermisosGlobales({ id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
    staleTime: 1000 * 60 * 5,
  });
};
