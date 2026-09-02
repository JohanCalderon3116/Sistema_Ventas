import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ConvertirCapitalize,
  useAsignacionCajaSucursalesStore,
  useCajasStore,
  useEmpresaStore,
  useSucursalesStore,
  useUsuariosStore,
} from "..";
import { toast } from "sonner";
import Swal from "sweetalert2";

export const useMostrarSucursalesXEmpresaStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarSucursales } = useSucursalesStore();
  return useQuery({
    queryKey: ["mostrar sucursales", dataempresa?.id],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
export const useMostrarCajaPorSucursalQueryStack = () => {
  const { sucursalesItemSelect } = useSucursalesStore();
  const { mostrarCajaXSucursal } = useCajasStore();
  return useQuery({
    queryKey: [
      "mostrar caja por sucursal",
      {
        id_sucursal: sucursalesItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarCajaXSucursal({
        id_sucursal: sucursalesItemSelect?.id,
      }),
    enabled: !!sucursalesItemSelect,
    staleTime: 1000 * 60 * 5,
  });
};
export const useMostrarCajasPorSucursalQueryStack = () => {
  const { mostrarCajasPorSucursal } = useSucursalesStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["mostrar cajas por sucursal"],
    queryFn: () => mostrarCajasPorSucursal({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
};
export const useInsertarSucursalesMutationStack = () => {
  const queryClient = useQueryClient();
  const {
    sucursalesItemSelect,
    editarSucursal,
    insertarSucursal,
    accion,
    setStateSucursal,
  } = useSucursalesStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarCajaXSucursal } = useCajasStore();
  const { datausuarios } = useUsuariosStore();
  const { insertarAsignacionSucusal } = useAsignacionCajaSucursalesStore();
  const insertar = async (data) => {
    if (accion == "Editar") {
      const p = {
        id: sucursalesItemSelect?.id,
        nombre: ConvertirCapitalize(data.nombre),
        direccion_fiscal: data.direccion_fiscal,
      };
      await editarSucursal(p);
    } else {
      const p = {
        nombre: ConvertirCapitalize(data.nombre),
        direccion_fiscal: data.direccion_fiscal,
        id_empresa: dataempresa?.id,
      };
      const response = await insertarSucursal(p);
      const cajas = await mostrarCajaXSucursal({ id_sucursal: response?.id });
      const cajaPrincipal = cajas?.[0];
      const pAsignaciones = {
        id_sucursal: response?.id,
        id_usuario: datausuarios?.id,
        id_caja: cajaPrincipal?.id,
      };
      await insertarAsignacionSucusal(pAsignaciones);
    }
  };
  return useMutation({
    mutationKey: ["insertar sucursal"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos registrar la sucursal, algo falló en el proceso. ${error.message}  Revisa la información e inténtalo de nuevo 😟`,
      );
    },
    onSuccess: () => {
      toast.success(
        "La sucursal quedó registrada correctamente y ya está lista para usarse 🙂",
      );
      queryClient.invalidateQueries(["mostrar cajas por sucursal"]);
      setStateSucursal(false);
    },
  });
};
export const useEliminarSucursalesMutationStack = () => {
  const queryClient = useQueryClient();
  const { eliminarSucursal } = useSucursalesStore();
  const controladorEliminarSucursal = (id) => {
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
            await eliminarSucursal({ id: id });
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
    mutationKey: ["eliminar sucursal"],
    mutationFn: controladorEliminarSucursal,
    onError: (error) => {
      if (error.message === "Eliminación cancelada") {
        toast.info("Eliminacion cancelada");
        return;
      }
      toast.error(
        `No pudimos eliminar la sucursal, algo falló en el proceso. Inténtalo de nuevo 😔`,
      );
    },
    onSuccess: () => {
      toast.success(
        "La sucursal se eliminó correctamente y ya no aparecerá en tu lista 😌",
      );
      queryClient.invalidateQueries(["mostrar cajas por sucursal"]);
    },
  });
};
