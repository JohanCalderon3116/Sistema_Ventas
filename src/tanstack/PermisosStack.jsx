import { useQuery } from "@tanstack/react-query";
import { usePermisosStore } from "../store/PermisosStore";
import { useUsuariosStore } from "../store/UsuariosStore";

export const useMostrarPermisosConfiguracionesQueryStack = () => {
  const { datausuarios } = useUsuariosStore();
  const { mostrarPermisosConfiguraciones } = usePermisosStore();
  return useQuery({
    queryKey: ["mostrar permisos configuracion", datausuarios?.id],
    queryFn: () =>
      mostrarPermisosConfiguraciones({
        id_usuario: datausuarios?.id,
      }),
    enabled: !!datausuarios,
    staleTime: 1000 * 60 * 5,
    retry: 1,
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
    retry: 1,
  });
};
export const useMostrarPermisosDefaultQueryStack = () => {
  const { mostrarPermisosDefault } = usePermisosStore();
  return useQuery({
    queryKey: ["mostrar permisos default"],
    queryFn: mostrarPermisosDefault,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const useMostrarPermisosPorUsuariosQueryStack = (
  selectItemAsignaciones,
) => {
  const { mostrarPermisos } = usePermisosStore();
  return useQuery({
    queryKey: [
      "mostrar permisos por usuarios",
      selectItemAsignaciones?.id_usuario,
    ],
    queryFn: () =>
      mostrarPermisos({ id_usuario: selectItemAsignaciones?.id_usuario }),
    enabled: !!selectItemAsignaciones,
    retry: 1,
  });
};
