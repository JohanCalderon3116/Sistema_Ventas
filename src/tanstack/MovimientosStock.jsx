import { useQuery } from "@tanstack/react-query";
import { useProductosStore } from "../store/ProductosStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMovStockStore } from "../store/MovStockStore";

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
    enabled: !!dataempresa,
  });
};
