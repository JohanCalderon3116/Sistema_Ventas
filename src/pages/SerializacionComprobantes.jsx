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
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { AbrirCajaSerealizacion } from "./AbrirCajaSerealizacion";
import { useNavigate } from "react-router-dom";

export const SerializacionComprobantes = () => {
  const navigate = useNavigate();
  const { dataCierreCaja } = useCierreCajaStore();
  const { data, isLoading, error } = useMostrarSerealizacionesQueryStack();
  const { isPending, mutate } = useEditarSerealizacionDefaultMutationStack();
  const { setItemSelect, setStateClose, stateClose } = useGlobalStore();
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
    <Container>
      {dataCierreCaja ? (
        <SerealizacionesTemplate
          data={data}
          title={"Comprobante"}
          Table={<TablaSerializaciones data={data}></TablaSerializaciones>}
          Formularioregistro={RegistrarSerializacion}
        ></SerealizacionesTemplate>
      ) : (
        <AbrirCajaSerealizacion
          onClose={() => navigate("/")}
        ></AbrirCajaSerealizacion>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
