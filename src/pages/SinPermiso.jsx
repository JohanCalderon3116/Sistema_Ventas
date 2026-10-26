import styled from "styled-components";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const SinPermiso = () => {
  return (
    <Container>
      <IconWrapper>
        <Icon icon="lucide:shield-alert" width="44" height="44" />
      </IconWrapper>
      <Title>Acceso Restringido</Title>
      <Subtitle>
        No cuentas con los permisos necesarios para acceder a este módulo.
        Contacta al administrador del sistema.
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
  gap: 14px;
  text-align: center;
  padding: 24px;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
`;

const IconWrapper = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.22);
  color: #8b5cf6;
  margin-bottom: 4px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colorSubtitle};
  margin: 0;
  max-width: 420px;
  font-size: 15px;
  line-height: 1.5;
`;

const StyledLink = styled(Link)`
  margin-top: 12px;
  padding: 11px 22px;
  border-radius: 10px;
  background-color: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease-out;
  &:hover {
    transform: translateY(-1px);
    border-color: rgba(139, 92, 246, 0.35);
    background-color: #27272a;
  }
`;
