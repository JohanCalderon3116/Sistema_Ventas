import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { toast } from "sonner";
import { useGlobalStore } from "../store/GlobalStore";
import { useMonedasStore } from "../store/MonedasStore";
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
        telefono_celular: data.telefono_celular,
      };
      await editarEmpresa(p, dataempresa?.logo, file);
    },
    onError: (error) => {
      toast.error(`Aggg, no pudimos actualizar tu empresa 😖`);
    },
    onSuccess: () => {
      toast.success("¡Listo! Tu empresa se actualizó con éxito 🥳");
      queryClient.invalidateQueries(["mostrar empresa"]);
    },
  });
};
export const useUpdatEmpresaTicketMutateStack = () => {
  const { file } = useGlobalStore();
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
      toast.error(`No pudimos actualizar tu ticket 😕 ${error.message}`);
    },
    onSuccess: () => {
      toast.success("¡Datos guardados! Tu ticket se actualizó con éxito 🎉");
      queryClient.invalidateQueries(["mostrar ticket"]);
    },
  });
};
export const useeditarMonedaConfigEmpresaMutationStack = () => {
  const queryClient = useQueryClient();
  const { dataempresa, editarMondaEmpresa } = useEmpresaStore();
  const { selectedCountry } = useMonedasStore();
  const editar = async () => {
    const p = {
      id: dataempresa?.id,
      simbolo_moneda: selectedCountry.symbol,
      iso: selectedCountry.iso,
      pais: selectedCountry.countryName,
      currency: selectedCountry.currency,
    };
    await editarMondaEmpresa(p);
  };
  return useMutation({
    mutationKey: "editar empresa moneda",
    mutationFn: editar,
    onError: (error) => {
      toast.error(
        `No se pudo actualizar la moneda de tu país, ${error.message} inténtalo de nuevo 😩`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("mostrar empresa");
      toast.success("La moneda de tu país se actualizó correctamente 😃");
    },
  });
};
