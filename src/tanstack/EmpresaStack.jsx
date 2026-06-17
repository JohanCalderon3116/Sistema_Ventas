import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { toast } from "sonner";
import { useGlobalStore } from "../store/GlobalStore";
export const useUpdatEmpresaMutateStack = () => {
  const queryClient = useQueryClient();
  const { dataempresa, editarEmpresa } = useEmpresaStore();
  const { file } = useGlobalStore();
  return useMutation({
    mutationKey: ["editar empresa"],
    mutationFn: async (data) => {
      const p = {
        id: dataempresa?.id,
        nombre: data.nombre,
        direccion_fiscal: data.direccion,
        impuesto: data.impuesto,
        valor_impuesto: parseFloat(data.valor_impuesto),
      };
      await editarEmpresa(p, dataempresa?.logo, file);
    },
    onError: (error) => {
      toast.error(
        `Lo sentimos, no pudimos actualizar tu empresa :/ ${error.message}`,
      );
    },
    onSuccess: () => {
      toast.success("Datos guardados, tu empresa se actualizo con exito :p");
      queryClient.invalidateQueries(["mostrar empresa"]);
    },
  });
};
export const useUpdatEmpresaTicketMutateStack = (file) => {
  const queryClient = useQueryClient();
  const { dataempresa, editarEmpresa } = useEmpresaStore();
  return useMutation({
    mutationKey: ["editar empresa"],
    mutationFn: async (data) => {
      const p = {
        id: dataempresa?.id,
        nombre: data?.nombre,
        id_fiscal: data?.id_fiscal,
        direccion_fiscal: data?.direccion_fiscal,
        nombre_moneda: data?.nombre_moneda,
        pie_pagina_ticket: data?.pie_pagina_ticket,
      };
      await editarEmpresa(p, dataempresa?.logo, file);
    },
    onError: (error) => {
      toast.error(
        `LO sentimos, no pudimos actualizar tu empresa :/ ${error.message}`,
      );
    },
    onSuccess: () => {
      toast.success("Datos guardados, tu empresa se actualizo con exito :p");
      queryClient.invalidateQueries(["mostrar empresa"]);
    },
  });
};
