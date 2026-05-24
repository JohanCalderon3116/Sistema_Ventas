import styled from "styled-components";
import {
  ConfiguracionesTemplate,
  Spinner1,
  useAsignacionCajaSucursalesStore,
  useModulosStore,
  usePermisosStore,
  useUsuariosStore,
} from "../index";
import { useQuery } from "@tanstack/react-query";

export const Configuraciones = () => {
  const { datausuarios } = useUsuariosStore();
  const { mostrarPermisosConfiguraciones } = usePermisosStore();
  const { isLoading, error } = useQuery({
    queryKey: "mostrar permisos configuracion",
    queryFn: () =>
      mostrarPermisosConfiguraciones({
        id_usuario: datausuarios?.id,
      }),
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  if (error) {
    return <span>Error XD</span>;
  }
  return <ConfiguracionesTemplate></ConfiguracionesTemplate>;
};
