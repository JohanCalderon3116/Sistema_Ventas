import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSerealizacionesStore } from "../store/SerealizacionesStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { useGlobalStore } from "../store/GlobalStore";
import { toast } from "sonner";
import { useCierreCajaStore } from "../store/CierreCajaStore";

export const useMostrarSerealizacionesQueryStack = () => {
  const { mostrarSerealizaciones } = useSerealizacionesStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: ["mostrar serealizaciones"],
    queryFn: () =>
      mostrarSerealizaciones({
        sucursal_id: dataCierreCaja?.caja?.id_sucursal,
      }),
    enabled: !!dataCierreCaja,
  });
};
export const useMostrarSerealizacionesVentasQueryStack = () => {
  const { mostrarSerealizacionesVentas } = useSerealizacionesStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: ["mostrar serealizaciones ventas"],
    queryFn: () =>
      mostrarSerealizacionesVentas({
        sucursal_id: dataCierreCaja?.caja?.id_sucursal,
      }),
    enabled: !!dataCierreCaja,
  });
};
export const useEditarSerealizacionDefaultMutationStack = () => {
  const { editarSerealizacionDefaul } = useSerealizacionesStore();
  const { itemSelect } = useGlobalStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["editar serealizacion por defecto"],
    mutationFn: async () => {
      const p = {
        _id: itemSelect?.id,
        _id_sucursal: itemSelect?.sucursal_id,
      };
      await editarSerealizacionDefaul(p);
    },
    onError: (error) => {
      toast.error("Tuvimos un problema al intentar editar: " + error.message);
    },
    onSuccess: () => {
      toast.success("Datos guardados");
      queryClient.invalidateQueries(["mostrar serealizaciones"]);
    },
  });
};

export const useEditarSerealizaciontMutationStack = () => {
  const { editarSerealizacion } = useSerealizacionesStore();
  const { itemSelect, setStateClose } = useGlobalStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["editar serealizacion"],
    mutationFn: async (data) => {
      const p = {
        id: itemSelect?.id,
        cantidad_numeros: data.cantidad_numeros,
        correlativos: data.correlativos,
        serie: data.serie,
      };
      await editarSerealizacion(p);
    },
    onError: (error) => {
      toast.error("Tuvimos un problema al intentar editar: " + error.message);
    },
    onSuccess: () => {
      toast.success("Datos guardados");
      queryClient.invalidateQueries(["mostrar serealizaciones"]);
      setStateClose(false);
    },
  });
};
