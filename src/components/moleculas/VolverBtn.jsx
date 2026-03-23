import { Icon } from "@iconify/react";
import styled from "styled-components";

export const VolverBtn = ({ funcion }) => {
  return (
    <Container onClick={funcion}>
      <Icon
        icon="line-md:arrow-small-left"
        width="24"
        height="24"
        className="icon"
      />
      <span>Volver</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  .icono {
    font-size: 25px;
  }
  margin-bottom: 30px;
`;
