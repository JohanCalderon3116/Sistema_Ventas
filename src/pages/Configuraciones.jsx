import styled from "styled-components";
import { ConfiguracionesTemplate, Spinner1, useModulosStore } from "../index";
import { useQuery } from "@tanstack/react-query";

export const Configuraciones = () => {
  const { mostrarmodulos } = useModulosStore();
  const { isLoading, error } = useQuery({
    queryKey: "mostra modulos",
    queryFn: mostrarmodulos,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>
  }
  if (error) {
    return <span>Error XD</span>;
  }
  return <ConfiguracionesTemplate></ConfiguracionesTemplate>;
};
