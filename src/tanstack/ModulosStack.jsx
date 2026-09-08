import { useQuery } from "@tanstack/react-query";
import { useModulosStore } from "../store/ModulosStore";

export const useMostrarModulosQueryStack = () => {
  const { mostrarmodulos } = useModulosStore();
  return useQuery({
    queryKey: ["mostrar modulos"],
    queryFn: mostrarmodulos,
  });
};
