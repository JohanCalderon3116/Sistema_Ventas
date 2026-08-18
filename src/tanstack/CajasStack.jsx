import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCajasStore } from "../store/CajaStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { toast } from "sonner";
import Swal from "sweetalert2";

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
export const useElimarCajasMutationStack = () => {
  const queryClient = useQueryClient();
  const { eliminarCaja } = useCajasStore();
  const controladorEliminarCaja = (id) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "¿Estás seguro(a)(o)?",
        text: "Una vez eliminado, se eliminaran todas las ventas relacionadas",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await eliminarCaja({ id: id });
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error("Eliminación cancelada"));
        }
      });
    });
  };
  return useMutation({
    mutationKey: ["eliminar caja"],
    mutationFn: controladorEliminarCaja,
    onError: (error) => {
      if (error.message === "Eliminación cancelada") {
        toast.info("Eliminacion cancelada");
        return;
      }
      toast.error(
        `No pudimos eliminar la caja, algo falló en el proceso. Inténtalo de nuevo 😖`,
      );
    },
    onSuccess: () => {
      toast.success(
        "La caja se eliminó correctamente y ya no aparecerá en tu lista 🥰",
      );
      queryClient.invalidateQueries(["mostrar cajas por sucursal"]);
    },
  });
};
