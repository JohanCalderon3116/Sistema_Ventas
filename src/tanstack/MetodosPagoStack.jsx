import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";

export const useMostrarMetodosDePagoQueryStack = () => {
  const { mostrarMetodosPago } = useMetodosPagoStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["mostrar metodos de pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
};
