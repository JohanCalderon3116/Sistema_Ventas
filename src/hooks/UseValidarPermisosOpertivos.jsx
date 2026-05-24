import { toast } from "sonner";
import { usePermisosStore } from "../store/PermisosStore";

export const useValidarPermisosOpertivos = () => {
  const { dataPermisosGlobales } = usePermisosStore();
  const validarPermiso = (p) => {
    const hasPermission = dataPermisosGlobales?.some(
      (item) => item.modulos?.nombre === p,
    );
    if (!hasPermission) {
      toast.warning("No tienes permiso para hacer esta acción...");
      return false;
    }
    return true;
  };
  return { validarPermiso };
};
