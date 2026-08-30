import { useQuery } from "@tanstack/react-query";
import { useProductosStore } from "../store/ProductosStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useStockStore } from "../store/StockStore";
import { useSucursalesStore } from "../store/SucursalesStore";

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
export const useMostrarStckAlmacenYProductoQueryStack = ({ dataSelect }) => {
  const { almacenSelelctItem } = useAlmacenesStore();
  const { mostrarStockAlmacenYProducto } = useStockStore();
  return useQuery({
    queryKey: [
      "mostrar stock almacen y producto",
      { id_producto: dataSelect.id, id_almacen: almacenSelelctItem?.id },
    ],
    queryFn: () =>
      mostrarStockAlmacenYProducto({
        id_almacen: almacenSelelctItem?.id,
        id_producto: dataSelect?.id,
      }),
  });
};
export const useMostrarStockQueryStack = () => {
  const { almacenSelelctItem } = useAlmacenesStore();
  const { mostrarStockAlmacenYProducto } = useStockStore();
  const { ProductosItemSelect } = useProductosStore();
  const { dataSucursales } = useSucursalesStore();
  return useQuery({
    queryKey: [
      "mostrar stock almacen y producto",
      {
        id_producto: ProductosItemSelect?.id,
        id_almacen: almacenSelelctItem?.id,
      },
    ],
    queryFn: () =>
      mostrarStockAlmacenYProducto({
        id_almacen: almacenSelelctItem?.id,
        id_producto: ProductosItemSelect?.id,
      }),
    enabled: !!dataSucursales,
  });
};
