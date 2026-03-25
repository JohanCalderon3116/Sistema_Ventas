import { useQuery } from "@tanstack/react-query";
import {
  MetodosPagoTemplate,
  Spinner1,
  useEmpresaStore,
  useMetodosPagoStore,
} from "../index";

export const MetodosPago = () => {
  const { mostrarMetodosPago } = useMetodosPagoStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar metodos pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  if (error) {
    return <span>Error: {error.message} </span>;
  }
  return <MetodosPagoTemplate></MetodosPagoTemplate>
};
