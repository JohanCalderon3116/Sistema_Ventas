import styled, { keyframes } from "styled-components";
import { Device } from "../../../styles/breakpoints";
import { DateRangeFilter } from "./DateRangeFilter";
import { Icon } from "@iconify/react";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useEffect, useState } from "react";

const AVATAR_DEFAULT =
  "https://i.ibb.co/KjJmzQYz/persona-de-libre-dedicacion.png";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulseDot = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
  }
`;

const saludos = [
  "¡Bienvenido de nuevo!",
  "Welcome back!",
  "Bem-vindo de volta!",
  "Bienvenue !",
  "Benvenuto!",
  "Willkommen!",
  "ようこそ！",
  "환영합니다!",
  "欢迎回来！",
];

const formatearNombre = (nombre = "") =>
  nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");

export const DashboardHeader = () => {
  const { datausuarios } = useUsuariosStore();
  const nombre = formatearNombre(datausuarios?.nombres || "Usuario");
  const rol = datausuarios?.roles?.nombre || "";
  const logoUsuario =
    !datausuarios?.logo || datausuarios.logo === "-"
      ? AVATAR_DEFAULT
      : datausuarios.logo;

  const [texto, setTexto] = useState("");
  const [idioma, setIdioma] = useState(0);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    const mensajeActual = saludos[idioma];
    let timeout;

    if (!borrando) {
      if (texto.length < mensajeActual.length) {
        timeout = setTimeout(() => {
          setTexto(mensajeActual.slice(0, texto.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setBorrando(true), 2200);
      }
    } else if (texto.length > 0) {
      timeout = setTimeout(() => {
        setTexto(mensajeActual.slice(0, texto.length - 1));
      }, 28);
    } else {
      timeout = setTimeout(() => {
        setBorrando(false);
        setIdioma((prev) => (prev + 1) % saludos.length);
      }, 350);
    }
    return () => clearTimeout(timeout);
  }, [texto, idioma, borrando]);

  return (
    <Container>
      <GreetingCard>
        <AvatarWrapper>
          <Avatar
            src={logoUsuario}
            alt={nombre}
            onError={(e) => {
              e.currentTarget.src = AVATAR_DEFAULT;
            }}
          />
          <StatusDot title="En línea" />
        </AvatarWrapper>

        <TextContainer>
          <GreetingTop>
            <GreetingBadge>
              <Icon icon="lucide:sparkles" />
              <span>{texto}</span>
              <Cursor aria-hidden="true">|</Cursor>
            </GreetingBadge>
            {rol && <RoleBadge>{rol}</RoleBadge>}
          </GreetingTop>

          <UserName title={nombre}>{nombre}</UserName>
        </TextContainer>
      </GreetingCard>

      <ActionsContainer>
        <DateRangeFilter />
      </ActionsContainer>
    </Container>
  );
};

const Container = styled.div`
  --borde: ${({ theme }) => theme.color2};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 16px;
  @media ${Device.desktop} {
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
`;

const GreetingCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 14px 20px;
  border-radius: 16px;
  border: 1px solid var(--borde);
  background-color: ${({ theme }) => theme.bgcards};
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.2s ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: ${({ theme }) => theme.text};
    opacity: 0.85;
  }

  &:hover {
    border-color: ${({ theme }) =>
      theme.text === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.24)"
        : "rgba(17, 17, 17, 0.24)"};
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  padding: 2px;
  background: ${({ theme }) => theme.bg2};
  border: 1.5px solid ${({ theme }) => theme.color2};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 46px;
    height: 46px;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

const StatusDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #10b981;
  border: 2px solid ${({ theme }) => theme.bgcards};
  animation: ${pulseDot} 2.4s infinite ease-in-out;
`;

const TextContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const GreetingTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 22px;
  flex-wrap: wrap;
`;

const GreetingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colorSubtitle};
  letter-spacing: 0.01em;
  line-height: 1.2;

  svg {
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    opacity: 0.85;
    flex-shrink: 0;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  font-weight: 400;
  opacity: 0.7;
  margin-left: -3px;
  animation: ${blink} 0.9s step-end infinite;
`;

const RoleBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  border: 1px solid var(--borde);
  line-height: 1.4;
`;

const UserName = styled.h1`
  margin: 0;
  font-size: clamp(18px, 1.85vw, 24px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const ActionsContainer = styled.div`
  flex-shrink: 0;
  border: 1px solid var(--borde);
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgcards};
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.2);
`;
