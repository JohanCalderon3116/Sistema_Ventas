import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCajasStore } from "../store/CajaStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useMovCajaStore } from "../store/MovCajaStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";

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
      queryClient.invalidateQueries({
        queryKey: ["mostrar cajas por sucursal"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar usuarios asignados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar usuarios asignados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar sucursales asignadas"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["mostrar cajas por sucursal"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar usuarios asignados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar usuarios asignados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar sucursales asignadas"],
      });
    },
  });
};
export const useAperturarCajasMutationStack = (item) => {
  const queryClient = useQueryClient();
  const fechaActual = useFormattedDate();
  const { datausuarios } = useUsuariosStore();
  const { aperturarCaja } = useCierreCajaStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { montoEfectivo, insertarMovcaja } = useMovCajaStore();
  const registrarMovCaja = async (p) => {
    const id_metodo_pago = dataMetodosPago
      .filter((item) => item.nombre === "Efectivo")
      .map((item) => item.id)[0];
    const pmovcaja = {
      fecha_movimiento: fechaActual,
      tipo_movimiento: "apertura",
      monto: montoEfectivo,
      id_metodo_pago: id_metodo_pago,
      descripcion: `Apertura de caja`,
      id_usuario: datausuarios?.id,
      id_cierre_caja: p.id_cierre_caja,
    };
    await insertarMovcaja(pmovcaja);
  };
  const insertar = async () => {
    const p = {
      fechainicio: fechaActual,
      fechacierre: fechaActual,
      id_usuario: datausuarios?.id,
      id_caja: item?.id_caja,
    };
    const data = await aperturarCaja(p);
    await registrarMovCaja({ id_cierre_caja: data?.id });
  };
  return useMutation({
    mutationKey: ["aperturar caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("La caja se aperturó correctamente 😌");
      queryClient.invalidateQueries({
        queryKey: ["mostrar cierre caja por empresa"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar caja aperturada por usuario"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar efectivo sin ventas movCaja"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar ventas metodoPago movCaja"],
      });
    },
    onError: (error) => {
      toast.error(`No pudimos aperturar la caja, algo falló en el proceso 😥`);
    },
  });
};
