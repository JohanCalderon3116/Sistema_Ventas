// components/paginas/SinPermiso.jsx
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const SinPermiso = () => {
  return (
    <Container>
      <Icon icon="fluent-emoji:locked" width="80" height="80" />
      <Title>No tienes permiso para acceder aquí</Title>
      <Subtitle>
        Si crees que esto es un error, contacta a un administrador.
      </Subtitle>
      <StyledLink to="/">Volver al inicio</StyledLink>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
  padding: 20px;
`;
const Title = styled.h2`
  font-size: 28px;
  margin: 0;
`;
const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
`;
const StyledLink = styled(Link)`
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #3300e3;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
`;
