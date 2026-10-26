import styled, { useTheme } from "styled-components";
import { ConfiguracionesTemplate, Spinner1 } from "../index";
import { useMostrarPermisosConfiguracionesQueryStack } from "../tanstack/PermisosStack";
import { BeatLoader } from "react-spinners";
import { toast, Toaster } from "sonner";

export const Configuraciones = () => {
  const { isLoading, error } = useMostrarPermisosConfiguracionesQueryStack();
  const theme = useTheme();
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
      "Tuvimos un error al tratar de cargar las configuracines 😑​",
    );
  }
  return (
    <>
      <Toaster richColors></Toaster>
      <ConfiguracionesTemplate></ConfiguracionesTemplate>
    </>
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
