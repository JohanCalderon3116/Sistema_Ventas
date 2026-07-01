import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useStockStore } from "../store/StockStore";

export const useMostrarStockAlmacenesyProductoQueryStack = () => {
  const { mostrarStockAlmacenesYProducto } = useStockStore();
  const { ProductosItemSelect } = useProductosStore();
  const { almacenSelelctItem } = useAlmacenesStore();
  return useQuery({
    queryKey: [
      "mostrar Stock Almacenes y Producto",
      {
        id_producto: ProductosItemSelect?.id,
        id_almacen: almacenSelelctItem?.id,
      },
    ],
    queryFn: () =>
      mostrarStockAlmacenesYProducto({
        id_producto: ProductosItemSelect?.id,
        id_almacen: almacenSelelctItem?.id,
      }),
  });
};
