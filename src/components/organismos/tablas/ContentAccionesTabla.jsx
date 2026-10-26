import styled from "styled-components";
import { AccionTabla } from "../../../index";
import { Icon } from "@iconify/react";

export function ContentAccionesTabla({ funcionEditar, funcionEliminar }) {
  return (
    <Container>
      {funcionEditar && (
        <AccionTabla
          funcion={funcionEditar}
          fontSize="17px"
          color="#10B981"
          icono={<Icon icon="lucide:pencil" />}
        />
      )}
      {funcionEliminar && (
        <AccionTabla
          funcion={funcionEliminar}
          fontSize="17px"
          color="#EF4444"
          icono={<Icon icon="lucide:trash-2" />}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  @media (max-width: 48em) {
    justify-content: end;
  }
`;
