import { useQuery } from "@tanstack/react-query";
import { useRolesStore } from "../store/RolesStore";

export const useMostrarRolesQueryStack = () => {
  const { mostrarRoles } = useRolesStore();
  return useQuery({
    queryKey: ["mostrar roles"],
    queryFn: mostrarRoles,
  });
};
