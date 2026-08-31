import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useSucursalesStore } from "../store/SucursalesStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { toast } from "sonner";
import { useEmpresaStore } from "../store/EmpresaStore";
import Swal from "sweetalert2";

export const useMostrarAlmacenesXSucursalQueryStack = () => {
  const { mostrarAlmacenesXSucursal } = useAlmacenesStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: [
      "mostrar almacenes por sucursal",
      dataCierreCaja?.caja?.id_sucursal,
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
      }),
    enabled: !!dataCierreCaja,
    refetchOnWindowFocus: false,
  });
};
export const useMostrarAlmacenesXSucursalItemSelectQueryStack = () => {
  const { mostrarAlmacenesXSucursal } = useAlmacenesStore();
  const { sucursalesItemSelect, dataSucursales } = useSucursalesStore();
  return useQuery({
    queryKey: ["mostrar almacenes por sucursal"],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: sucursalesItemSelect?.id,
      }),
    enabled: !!dataSucursales,
    refetchOnWindowFocus: false,
  });
};
export const useInsertarAlmacenesXSucursalMuattionStack = () => {
  const queryClient = useQueryClient();
  const {
    accion: accionAlmacen,
    almacenSelelctItem,
    editarAlmacenes,
    insertarAlmacenes,
    setStateAlmacen,
  } = useAlmacenesStore();
  const insertar = async (data) => {
    if (accionAlmacen == "Editar") {
      const p = {
        id: almacenSelelctItem?.id,
        nombre: ConvertirCapitalize(data.nombre),
      };
      await editarAlmacenes(p);
    } else {
      const p = {
        id_sucursal: almacenSelelctItem?.id,
        nombre: ConvertirCapitalize(data.nombre),
      };
      await insertarAlmacenes(p);
    }
  };
  return useMutation({
    mutationKey: ["insertar almacen"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos guardar tu almacén, ${error.message} algo falló en el proceso 😬`,
      );
    },
    onSuccess: () => {
      toast.success("Tu almacén quedó registrado correctamente 🥹");
      queryClient.invalidateQueries(["mostrar almacenes x empresa"]);
      setStateAlmacen(false);
    },
  });
};
export const useMostrarAlmacenesXEmpresaQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarAlmacenesXEmpresa } = useAlmacenesStore();
  return useQuery({
    queryKey: ["mostrar almacenes x empresa", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarAlmacenesXEmpresa({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
};
export const useEliminarAlmacenesMutationStack = () => {
  const queryClient = useQueryClient();
  const { eliminarAlmacen } = useAlmacenesStore();
  const controladorEliminarAlmacen = (id) => {
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
            await eliminarAlmacen({ id: id });
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
    mutationKey: ["eliminar almacenes"],
    mutationFn: controladorEliminarAlmacen,
    onError: (error) => {
      if (error.message === "Eliminación cancelada") {
        toast.info(error.message);
        return;
      }
      toast.error(
        `No pudimos eliminar tu almacén, algo falló en el proceso: ${error.message} 🤨`,
      );
    },
    onSuccess: () => {
      toast.success("Tu almacén se eliminó correctamente 🙃");
      queryClient.invalidateQueries(["mostrar almacenes x empresa"]);
    },
  });
};
