import { useMutation, useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { ConvertirMayusculas } from "../utils/Conversiones";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useStockStore } from "../store/StockStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { toast } from "sonner";

export const useBuscarProductosCodigoQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { buscador, buscarProductos } = useProductosStore();
  const texto = buscador.trim();
  const esCodigoDeBarras = /^[0-9]{3,}$/.test(texto);

  return useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: texto }),
    enabled: !!dataempresa && texto.length > 0 && !esCodigoDeBarras,
    refetchOnWindowFocus: false,
  });
};
export const useMostrarProductosQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarProductos } = useProductosStore();
  return useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () => mostrarProductos({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useBuscarProductosQueryStack = () => {
  const { buscarProductos, buscador } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useInsertarProductosMutationStack = ({
  accion,
  dataSelect,
  validarVacios,
  cerrarFormulario,
}) => {
  const { categoriaItemSelect } = useCategoriasStore();
  const {
    randomCodeBarras,
    randomCodeInterno,
    codigogenerado,
    sevendePor,
    stateInventarios,
    insertarProductos,
    setRandomCodeBarras,
    editarProductos,
  } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { dataStockXAlmacenYProducto, insertarStock } = useStockStore();
  const { almacenSelelctItem } = useAlmacenesStore();
  async function insertar(data) {
    validarVacios(data);
    if (accion === "Editar") {
      const p = {
        _id: dataSelect.id,
        _nombre: ConvertirMayusculas(data.nombre),
        _precio_venta: parseFloat(data.precio_venta),
        _precio_compra: parseFloat(data.precio_compra),
        _id_categoria: categoriaItemSelect.id,
        _codigo_barra: randomCodeBarras ? randomCodeBarras : codigogenerado,
        _codigo_interno: randomCodeInterno ? randomCodeInterno : codigogenerado,
        _id_empresa: dataempresa.id,
        _sevende_por: sevendePor,
        _maneja_inventarios: stateInventarios,
      };
      await editarProductos(p);
      if (stateInventarios) {
        if (!dataStockXAlmacenYProducto) {
          const pstock = {
            id_almacen: almacenSelelctItem.id,
            id_producto: dataSelect.id,
            stock: parseFloat(data.stock),
            stock_minimo: parseFloat(data.stock_minimo),
            ubicacion: data.ubicacion,
          };
          await insertarStock(pstock);
        }
      }
    } else {
      const p = {
        _nombre: ConvertirMayusculas(data.nombre),
        _precio_venta: parseFloat(data.precio_venta),
        _precio_compra: parseFloat(data.precio_compra),
        _id_categoria: categoriaItemSelect.id,
        _codigo_barra: randomCodeBarras ? randomCodeBarras : codigogenerado,
        _codigo_interno: randomCodeInterno ? randomCodeInterno : codigogenerado,
        _id_empresa: dataempresa.id,
        _sevende_por: sevendePor,
        _maneja_inventarios: stateInventarios,
        _maneja_multiprecios: false,
      };
      const id_producto_nuevo = await insertarProductos(p);
      if (stateInventarios) {
        const pstock = {
          id_almacen: almacenSelelctItem.id,
          id_producto: id_producto_nuevo,
          stock: parseFloat(data.stock),
          stock_minimo: parseFloat(data.stock_minimo),
          ubicacion: data.ubicacion,
        };
        await insertarStock(pstock);
      }
    }
  }
  return useMutation({
    mutationKey: "insertar productos",
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `¡Ups! Hubo un error al guardar. Inténtalo de nuevo. 😅 ${error.message}`,
      );
    },
    onSuccess: () => {
      toast.success("¡Genial! Tu producto se guardó correctamente. ✨😊");
      cerrarFormulario();
      setRandomCodeBarras("");
    },
  });
};
