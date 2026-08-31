import { useMutation, useQuery } from "@tanstack/react-query";
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
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useInsertarClientesProveedoresMutationStack = ({
  accion,
  dataSelect,
  cerrarFormulario,
}) => {
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
    mutationKey: "insertar clientes proveedores",
    onError: (error) => {
      toast.error(
        `No pudimos guardar los datos que ingresaste, algo falló en el proceso: ${error.message}. Revisa la información e inténtalo de nuevo 😣`,
      );
    },
    onSuccess: () => {
      toast.success(
        "Todo salió bien, la información quedó guardada correctamente y ya está disponible 🤗",
      );
      cerrarFormulario();
    },
  });
};
