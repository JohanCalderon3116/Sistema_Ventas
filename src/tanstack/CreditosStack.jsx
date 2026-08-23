import { useMutation, useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useCreditosStore } from "../store/CreditosStore";
import { useVentasStore } from "../store/VentasStore";
import { useDetalleVentasStore } from "../store/DetalleVentasStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useMovimientosCreditosStore } from "../store/MovimientosCreditosStore";
import { toast } from "sonner";

export const useMostrarCreditosQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCreditos } = useCreditosStore();
  return useQuery({
    queryKey: [
      "mostrar creditos",
      {
        id_empresa: dataempresa?.id,
      },
    ],
    queryFn: () =>
      mostrarCreditos({
        id_empresa: dataempresa?.id,
      }),
  });
};
export const useBuscarCreditsoQueryStack = () => {
  const { buscador: buscadorCreditos, buscarCreditos } = useCreditosStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["buscar creditos", buscadorCreditos],
    queryFn: () =>
      buscarCreditos({
        id_empresa: dataempresa?.id,
        nombres: buscadorCreditos,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useInsertarMovimientoCreditoMutationStack = ({
  onClose,
  resetFuction,
}) => {
  const { creditosItemSelect } = useCreditosStore();
  const { idventa } = useVentasStore();
  const { total } = useDetalleVentasStore();
  const { insertarMovimientosCreditos } = useMovimientosCreditosStore();
  const fecha = useFormattedDate();
  const insertar = async (data) => {
    const p = {
      id_credito: creditosItemSelect?.id,
      id_venta: idventa,
      tipo_movimiento: "venta",
      valor: total,
      observacion: data.observacion,
      fecha_movimiento: fecha,
    };
    await insertarMovimientosCreditos(p);
  };
  return useMutation({
    mutationKey: ["insertar movimiento creditos"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`🚨 Error al guardar: ${error.message} ⚠️`);
    },
    onSuccess: () => {
      toast.success("🎉 ¡Registro guardado correctamente! ✨");
      resetFuction();
      onClose();
    },
  });
};
