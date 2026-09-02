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
  });
};
