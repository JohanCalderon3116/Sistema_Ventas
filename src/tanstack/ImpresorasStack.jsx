import { useQuery } from "@tanstack/react-query";
import { useImpresorasStore } from "../store/ImpresorasStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";

export const useMostrarImpresorasXCajaQueryStack = () => {
  const { mostrarImpresorasXCaja } = useImpresorasStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: [
      "mostrar impresoras x caja",
      {
        id_caja: dataCierreCaja?.id_caja,
      },
    ],
    queryFn: () =>
      mostrarImpresorasXCaja({
        id_caja: dataCierreCaja?.id_caja,
      }),
    enabled: !!dataCierreCaja,
    refetchOnWindowFocus: false,
  });
};
