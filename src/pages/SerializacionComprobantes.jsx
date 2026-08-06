import styled, { useTheme } from "styled-components";
import { useMostrarSerealizacionesQueryStack } from "../tanstack/SerealizacionStack";
import { BeatLoader } from "react-spinners";
import { useGlobalStore } from "../store/GlobalStore";
import { TablaSerializaciones } from "../components/organismos/tablas/TablaSerealizaciones";
import { SerealizacionesTemplate } from "../components/templates/SerealizacionesTemplate";
import { RegistrarSerializacion } from "../components/organismos/formularios/RegistrarSerializacion";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { AbrirCajaSerealizacion } from "./AbrirCajaSerealizacion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

export const SerializacionComprobantes = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { dataCierreCaja } = useCierreCajaStore();
  const { data, isLoading, error } = useMostrarSerealizacionesQueryStack();
  const { setItemSelect, setStateClose, stateClose } = useGlobalStore();
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }
  if (error) {
    return toast.error(
      "Tuvimos un error al tratar de cargar las serializaciones 😑​",
    );
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
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
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
