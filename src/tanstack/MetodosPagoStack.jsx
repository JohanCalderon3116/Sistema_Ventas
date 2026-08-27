import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { toast } from "sonner";

export const useMostrarMetodosDePagoQueryStack = () => {
  const { mostrarMetodosPago } = useMetodosPagoStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["mostrar metodos de pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
};
export const useInsertarMetodosPagoMutationStack = (
  accion,
  dataSelect,
  cerrarFormulario,
) => {
  const queryClient = useQueryClient();
  const { editarMetodosPago, file, insertarMetodosPago } =
    useMetodosPagoStore();
  const { dataempresa } = useEmpresaStore();
  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        nombre: ConvertirCapitalize(data.nombre),
        id: dataSelect.id,
      };
      await editarMetodosPago(p, dataSelect.icono, file);
    } else {
      const p = {
        nombre: ConvertirCapitalize(data.nombre),
        id_empresa: dataempresa?.id,
        delete_update: true,
      };

      await insertarMetodosPago(p, file);
    }
  }
  return useMutation({
    mutationKey: "insertar metodos de pago",
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos guardar el método de pago, ${error.message} algo falló en el proceso. Revisa la información e inténtalo de nuevo 😥`,
      );
    },
    onSuccess: () => {
      toast.success(
        "El método de pago quedó guardado correctamente y ya está disponible 🥳",
      );
      queryClient.invalidateQueries(["mostrar metodos pago"]);
      cerrarFormulario();
    },
  });
};
