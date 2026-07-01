import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useVentasStore } from "../store/VentasStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { toast } from "sonner";

export const useEliminarVentasIncompletasMutateStack = () => {
  const { eliminarventasIncompletas } = useVentasStore();
  const { datausuarios } = useUsuariosStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["elimina ventas incompletas"],
    mutationFn: async () => {
      await eliminarventasIncompletas({
        id_usuario: datausuarios?.id,
        id_cierre_caja: dataCierreCaja?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
    },
  });
};

export const useMostrarVentasXSucursalQueryStack = () => {
  const { mostrarventasxsucursal } = useVentasStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: [
      "mostrar ventas x sucursal",
      { id_sucursal: dataCierreCaja?.caja?.id_sucursal },
    ],
    queryFn: () =>
      mostrarventasxsucursal({
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
      }),
  });
};
