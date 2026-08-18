import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCajasStore } from "../store/CajaStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { toast } from "sonner";

export const useInsertarCajasMutationStack = () => {
  const queryClient = useQueryClient();
  const {
    accion: accionCaja,
    cajaSelelctItem,
    editarCaja,
    insertarCaja,
    setStateCaja,
  } = useCajasStore();
  const { datausuarios } = useUsuariosStore();
  const { insertarAsignacionSucusal } = useAsignacionCajaSucursalesStore();
  const insertar = async (data) => {
    if (accionCaja == "Editar") {
      const p = {
        id: cajaSelelctItem?.id,
        descripcion: ConvertirCapitalize(data.descripcion),
      };
      await editarCaja(p);
    } else {
      const p = {
        descripcion: ConvertirCapitalize(data.descripcion),
        id_sucursal: cajaSelelctItem?.id,
      };
      const response = await insertarCaja(p);
      const pAsignaciones = {
        id_sucursal: cajaSelelctItem?.id,
        id_usuario: datausuarios?.id,
        id_caja: response?.id,
      };
      await insertarAsignacionSucusal(pAsignaciones);
    }
  };
  return useMutation({
    mutationKey: ["insertar caja"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos registrar la caja, algo falló en el proceso. Revisa la información e inténtalo de nuevo 😖`,
      );
    },
    onSuccess: () => {
      toast.success(
        "La caja quedó registrada correctamente y ya está lista para usarse 😎",
      );
      queryClient.invalidateQueries(["mostrar cajas por sucursal"]);
      setStateCaja(false);
    },
  });
};
