import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { useUsuariosStore } from "../store/UsuariosStore";
import { usePermisosStore } from "../store/PermisosStore";
import { useRolesStore } from "../store/RolesStore";
import { useSucursalesStore } from "../store/SucursalesStore";
import { useCajasStore } from "../store/CajaStore";
import { userAuth } from "../context/AuthContext";
import { useThemeStore } from "../store/ThemeStore";
import { Dark, Light } from "../styles/themes";

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
      queryClient.invalidateQueries({ queryKey: ["mostrar usuarios"] });
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
    retry: 1,
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
    enabled: !!dataempresa && buscador.trim().length > 0,
    retry: 1,
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
        id_sucursal: sucursalesItemSelect?.id,
        id_caja: cajaSelelctItem?.id,
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
      queryClient.invalidateQueries({
        queryKey: ["mostrar usuarios asignados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar usuarios asignados"],
      });
      onClose();
    },
  });
};
export const useMostrarUsuariosQueryStack = () => {
  const { mostrarusuarios } = useUsuariosStore();
  const { user } = userAuth();
  const id_auth = user?.id;
  return useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: () =>
      mostrarusuarios({
        id_auth: id_auth,
      }),
    refetchOnWindowFocus: false,
    enabled: !!id_auth,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
export const useEditarTemaMutationStack = () => {
  const queryClient = useQueryClient();
  const { setTheme, theme } = useThemeStore();
  const { datausuarios, editarUsuario } = useUsuariosStore();
  const EditarTemaUser = async () => {
    const themeUse = theme === "light" ? "dark" : "light";
    const themeStyle = datausuarios?.tema === "light" ? Dark : Light;
    setTheme({
      tema: themeUse,
      style: themeStyle,
    });
    const p = {
      id: datausuarios?.id,
      tema: themeUse,
    };
    await editarUsuario(p);
  };
  return useMutation({
    mutationKey: ["editar tema"],
    mutationFn: EditarTemaUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mostrar usuarios"] });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};
