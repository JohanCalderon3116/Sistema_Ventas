import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useLocation } from "react-router-dom";
import { useClientesProveedoresStore } from "../store/ClientesProveedoresStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { toast } from "sonner";

export const useMostrarClientesProveedoresQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCliPro } = useClientesProveedoresStore();
  const location = useLocation();
  return useQuery({
    queryKey: [
      "mostrar clientes proveedores",
      {
        dataempresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
      },
    ],
    queryFn: () =>
      mostrarCliPro({
        id_empresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const useBuscarClientesProveedoresLocationQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const location = useLocation();
  const { buscador, buscarCliPro } = useClientesProveedoresStore();
  return useQuery({
    queryKey: [
      "buscar clientes proveedores",
      {
        dataempresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
        buscador: buscador,
      },
    ],
    queryFn: () =>
      buscarCliPro({
        id_empresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
        buscador: buscador,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const useBuscarClientesQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { buscador, buscarCliPro } = useClientesProveedoresStore();
  return useQuery({
    queryKey: ["buscar cliente", dataempresa?.id, "cliente", buscador],
    queryFn: () =>
      buscarCliPro({
        id_empresa: dataempresa?.id,
        tipo: "cliente",
        buscador: buscador,
      }),
    enabled: !!dataempresa && buscador.trim().length > 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const useInsertarClientesProveedoresMutationStack = ({
  accion,
  dataSelect,
  cerrarFormulario,
}) => {
  const queryClient = useQueryClient();
  const { dataempresa } = useEmpresaStore();
  const { tipo, editarCliPro, insertarCliPro } = useClientesProveedoresStore();
  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        _id: dataSelect.id,
        _nombres: ConvertirCapitalize(data.nombres),
        _id_empresa: dataempresa?.id,
        _direccion: data.direccion,
        _telefono: data.telefono,
        _email: data.email,
        _identificador_nacional: data.identificador_nacional,
        _identificador_fiscal: data.identificador_fiscal || "-",
        _tipo: tipo,
      };
      await editarCliPro(p);
    } else {
      const p = {
        _nombres: ConvertirCapitalize(data.nombres),
        _id_empresa: dataempresa?.id,
        _direccion: data.direccion,
        _telefono: data.telefono,
        _email: data.email,
        _identificador_nacional: data.identificador_nacional,
        _identificador_fiscal: data.identificador_fiscal || "-",
        _tipo: tipo,
      };
      await insertarCliPro(p);
    }
  }
  return useMutation({
    mutationFn: insertar,
    mutationKey: ["insertar clientes proveedores"],
    onError: (error) => {
      toast.error(
        `No pudimos guardar los datos que ingresaste, algo falló en el proceso: ${error.message}. Revisa la información e inténtalo de nuevo 😣`,
      );
    },
    onSuccess: () => {
      toast.success(
        "Todo salió bien, la información quedó guardada correctamente y ya está disponible 🤗",
      );
      queryClient.invalidateQueries({
        queryKey: ["mostrar clientes proveedores"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar clientes proveedores"],
      });
      queryClient.invalidateQueries({ queryKey: ["buscar cliente"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar clientes"] });
      cerrarFormulario();
    },
  });
};
export const useMostrarClientesQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCliPro } = useClientesProveedoresStore();
  return useQuery({
    queryKey: [
      "mostrar clientes",
      { id_empresa: dataempresa?.id, tipo: "cliente" },
    ],
    queryFn: () =>
      mostrarCliPro({
        id_empresa: dataempresa?.id,
        tipo: "cliente",
      }),
    enabled: !!dataempresa,
    retry: 1,
  });
};
