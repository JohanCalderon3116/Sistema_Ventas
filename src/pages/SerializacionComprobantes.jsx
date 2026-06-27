import styled from "styled-components";
import {
  useEditarSerealizacionDefaultMutationStack,
  useMostrarSerealizacionesQueryStack,
} from "../tanstack/SerealizacionStack";
import { BarLoader } from "react-spinners";
import { CrudTemplate } from "../components/templates/CrudTemplate";
import { useGlobalStore } from "../store/GlobalStore";
import { TablaSerializaciones } from "../components/organismos/tablas/TablaSerealizaciones";
import { SerealizacionesTemplate } from "../components/templates/SerealizacionesTemplate";
import { RegistrarSerializacion } from "../components/organismos/formularios/RegistrarSerializacion";

export const SerializacionComprobantes = () => {
  const { data, isLoading, error } = useMostrarSerealizacionesQueryStack();
  const { isPending, mutate } = useEditarSerealizacionDefaultMutationStack();
  const { setItemSelect } = useGlobalStore();
  const editardefailt = (item) => {
    setItemSelect(item);
    mutate();
  };
  if (isLoading) {
    return <BarLoader></BarLoader>;
  }
  if (error) {
    return <span> `Error: ${error.message}` </span>;
  }
  return (
    <SerealizacionesTemplate
      data={data}
      title={"Comprobante"}
      Table={<TablaSerializaciones data={data}></TablaSerializaciones>}
      Formularioregistro={RegistrarSerializacion}
    ></SerealizacionesTemplate>
  );
};

const Container = styled.div``;
