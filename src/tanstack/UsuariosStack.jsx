import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { useUsuariosStore } from "../store/UsuariosStore";
import { usePermisosStore } from "../store/PermisosStore";
import { useRolesStore } from "../store/RolesStore";
import { useSucursalesStore } from "../store/SucursalesStore";
import { useCajasStore } from "../store/CajaStore";

export const useEditarUsuarioMutationStack = () => {
  const queryClient = useQueryClient();
  const { editarUsuario, datausuarios } = useUsuariosStore();
  return useMutation({
    mutationKey: ["editar perfil usuario"],
    mutationFn: async (data) => {
      const p = {
        id: datausuarios?.id,
        nombres: data?.nombres,
        nro_doc: data?.nro_doc,
        telefono: data?.telefono,
      };
      await editarUsuario(p);
    },
    onError: (error) => {
      toast.error(`Aish, algo falló actualizando tu perfil 😩`);
    },
    onSuccess: () => {
      toast.success("¡Perfil actualizado sin problema! 😎");
      queryClient.invalidateQueries(["mostrar usuarios"]);
    },
  });
};
export const useMostrarUsuariosAsignadosQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarUsariosAsignados } = useAsignacionCajaSucursalesStore();
  return useQuery({
    queryKey: ["mostrar usuarios asignados", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarUsariosAsignados({
        _id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
};
export const useBuscarUsuariosAsignados = () => {
  const { dataempresa } = useEmpresaStore();
  const { buscarUsariosAsignados, buscador } =
    useAsignacionCajaSucursalesStore();
  return useQuery({
    queryKey: [
      "buscar usuarios asignados",
      { id_empresa: dataempresa?.id, buscador: buscador },
    ],
    queryFn: () =>
      buscarUsariosAsignados({
        _id_empresa: dataempresa?.id,
        buscador: buscador,
      }),
    enabled: !!dataempresa,
  });
};
export const useInsertarUsuariosPorEmpresaMutationStack = ({
  accion,
  dataSelect,
  onClose,
}) => {
  const { editarUsuario, insertarUsuarios } = useUsuariosStore();
  const { actualizarPermisos, selectModules } = usePermisosStore();
  const { rolesItemSelect } = useRolesStore();
  const { sucursalesItemSelect } = useSucursalesStore();
  const { cajaSelelctItem } = useCajasStore();
  const queryClient = useQueryClient();
  const insertar = async (data) => {
    if (accion === "Editar") {
      const p = {
        id: dataSelect?.id_usuario,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        correo: data.email,
      };
      await editarUsuario(p);
      await actualizarPermisos({
        id_usuario: dataSelect?.id_usuario,
        modulos: selectModules,
      });
    } else {
      const p = {
        id: accion === "Editar" ? dataSelect?.id : null,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id,
        correo: data.email,
        // datos asignacion caja y sucursal
        id_sucursal: sucursalesItemSelect?.id,
        id_caja: cajaSelelctItem?.id,
        //datos credenciales
        email: data.email,
        pass: data.pass,
      };
      await insertarUsuarios(p);
    }
  };
  return useMutation({
    mutationKey: ["insertar usuarios"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No se pudo guardar, inténtalo otra vez. 😵‍💫⚠️ ${error.message}`,
      );
    },
    onSuccess: () => {
      toast.success("¡Hecho! Ya quedó registrado. ✌️😎");
      queryClient.invalidateQueries(["mostrar usuarios asignados"]);
      onClose();
    },
  });
};
