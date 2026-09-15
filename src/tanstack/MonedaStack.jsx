import { useQuery } from "@tanstack/react-query";
import { useMonedaStore } from "../store/MonedaStore";

export const useMostrarMonedaQueryStack = () => {
  const { mostrarMoneda } = useMonedaStore();
  return useQuery({
    queryKey: ["mostrar moneda"],
    queryFn: mostrarMoneda,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
