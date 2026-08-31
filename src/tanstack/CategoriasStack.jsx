import { useMutation, useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useCategoriasStore } from "../store/CategoriasStore";
import { ConvertirCapitalize } from "../utils/Conversiones";
import { toast } from "sonner";

export const useMostrarCategoriasQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCategorias } = useCategoriasStore();
  return useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useBuscarCategoriasQueryStack = () => {
  const { buscador, buscarCategorias } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["buscar categorias", buscador],
    queryFn: () =>
      buscarCategorias({ id_empresa: dataempresa?.id, descripcion: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useInsertarCategoriasMutationStack = ({
  accion,
  dataSelect,
  cerrarFormulario,
}) => {
  const { dataempresa } = useEmpresaStore();
  const { currentColor, editarCategorias, file, insertarCategorias } =
    useCategoriasStore();
  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        _nombre: ConvertirCapitalize(data.descripcion),
        _idempresa: dataempresa.id,
        _color: currentColor,
        _id: dataSelect.id,
      };
      await editarCategorias(p, dataSelect.icono, file);
    } else {
      const p = {
        _nombre: ConvertirCapitalize(data.descripcion),
        _color: currentColor,
        _icono: "-",
        _id_empresa: dataempresa.id,
      };
      await insertarCategorias(p, file);
    }
  }
  return useMutation({
    mutationFn: insertar,
    mutationKey: "insertar categorias",
    onError: (error) => {
      toast.error(
        `No pudimos guardar tu categoría, algo falló en el proceso. ${error.message} Inténtalo de nuevo 😩`,
      );
    },
    onSuccess: () => {
      toast.success("Tu categoría quedó guardada correctamente 😄");
      cerrarFormulario();
    },
  });
};
