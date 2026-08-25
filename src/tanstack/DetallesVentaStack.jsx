import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDetalleVentasStore } from "../store/DetalleVentasStore";
import { useVentasStore } from "../store/VentasStore";

export const useEditarCantidadDetalleVentaMutationStack = () => {
  const queryClient = useQueryClient();
  const { editarCantidadDetalleVenta } = useDetalleVentasStore();
  const EditarCantidadDv = async (data) => {
    const p = {
      _id: data.id,
      _cantidad: data.cantidad,
    };
    await editarCantidadDetalleVenta(p);
  };
  return useMutation({
    mutationKey: ["editar cantidad detalle venta"],
    mutationFn: EditarCantidadDv,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
    },
  });
};
export const useEliminarCantidadDetalleVentaMutationStack = () => {
  const queryClient = useQueryClient();
  const { eliminardetalleventa } = useDetalleVentasStore();
  const EliminarDV = async (p) => {
    await eliminardetalleventa({ id: p.id });
  };
  return useMutation({
    mutationKey: ["elminar cantidad detalle venta"],
    mutationFn: EliminarDV,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
    },
  });
};
export const useMostrarDetalleVentaQueryStack = () => {
  const { idventa } = useVentasStore();
  const { mostrardetalleventa } = useDetalleVentasStore();
  return useQuery({
    queryKey: ["mostrar detalle venta", { id_vanta: idventa }],
    queryFn: () => mostrardetalleventa({ id_venta: idventa }),
    enabled: idventa > 0,
  });
};
