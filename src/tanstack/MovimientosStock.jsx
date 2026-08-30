import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProductosStore } from "../store/ProductosStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMovStockStore } from "../store/MovStockStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useStockStore } from "../store/StockStore";
import { toast } from "sonner";

export const useMostrarMovimientosStockQueryStack = () => {
  const { ProductosItemSelect } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarMovStock } = useMovStockStore();
  return useQuery({
    queryKey: ["mostrar movimientos de stock", ProductosItemSelect?.id],
    queryFn: () =>
      mostrarMovStock({
        id_empresa: dataempresa?.id,
        id_producto: ProductosItemSelect?.id,
      }),
    enabled: !!dataempresa && !!ProductosItemSelect?.id, 
    placeholderData: keepPreviousData,
  });
};
export const useInsertarMovStcoMutationStack = ({ onClose, resetFuction }) => {
  const queryClient = useQueryClient();
  const { almacenSelelctItem } = useAlmacenesStore();
  const { ProductosItemSelect } = useProductosStore();
  const fechaactual = useFormattedDate();
  const { tipo, insertarMovStock } = useMovStockStore();
  const { dataStockXAlmacenYProducto, editarStock } = useStockStore();
  const insertar = async (data) => {
    const pMovimientosStock = {
      id_almacen: almacenSelelctItem?.id,
      id_producto: ProductosItemSelect?.id,
      tipo_movimiento: tipo,
      cantidad: parseFloat(data.cantidad),
      detalle: data.detalle ? data.detalle : "Registro de inventario manual",
      origen: "inventario",
    };
    const pStock = {
      _id: dataStockXAlmacenYProducto?.id,
      cantidad: parseFloat(data.cantidad),
    };
    await insertarMovStock(pMovimientosStock);
    await editarStock(pStock, tipo);
  };
  return useMutation({
    mutationKey: ["insertar movimiento stock"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos registrar el movimiento de stock ${error.message}, algo falló en el proceso 😓`,
      );
    },
    onSuccess: () => {
      toast.success("El movimiento de stock quedó registrado correctamente 🫡");
      queryClient.invalidateQueries(["buscar productos"]);
      onClose();
      resetFuction();
    },
  });
};
