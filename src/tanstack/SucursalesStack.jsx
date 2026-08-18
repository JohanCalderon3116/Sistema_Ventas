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

export const useMostrarSucursalesXEmpresaStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarSucursales } = useSucursalesStore();
  return useQuery({
    queryKey: ["mostrar sucursales", dataempresa?.id],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
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
