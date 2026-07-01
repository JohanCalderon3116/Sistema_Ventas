import { useQuery } from "@tanstack/react-query";
import { useCajasStore } from "../store/CajaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { useUsuariosStore } from "../store/UsuariosStore";

export const useMostrarSucursalesAsignadsQueryStack = () => {
  const { mostrarSucursalCajaAsignada } = useAsignacionCajaSucursalesStore();
  const { datausuarios } = useUsuariosStore();
  return useQuery({
    queryKey: [
      "mostrar sucursales asignadas",
      { id_usuario: datausuarios?.id },
    ],
    queryFn: () =>
      mostrarSucursalCajaAsignada({
        id_usuario: datausuarios?.id,
      }),
    enabled: !!datausuarios,
  });
};
