import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useCierreCajaStore } from "../../../store/CierreCajaStore";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import { useEliminarVentasMutationStack } from "../../../tanstack/VentasStack";

export const MenuFlotante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setStateIngresoSalida, setTipoRegistro, setStateCierreCaja } =
    useCierreCajaStore();
  const { mutate: mutateEliminarVenta } = useEliminarVentasMutationStack();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Container>
      <MenuItems isOpen={isOpen}>
        <MenuItem
          isOpen={isOpen}
          delay="0s"
          onClick={() => {
            toggleMenu();
            setStateIngresoSalida(true);
            setTipoRegistro("ingreso");
          }}
        >
          <Icon icon="lucide:arrow-down-circle" />
          <Text>Ingresar dinero</Text>
        </MenuItem>
        <MenuItem
          isOpen={isOpen}
          delay="0.06s"
          onClick={() => {
            toggleMenu();
            setStateIngresoSalida(true);
            setTipoRegistro("salida");
          }}
        >
          <Icon icon="lucide:arrow-up-circle" />
          <Text>Retirar dinero</Text>
        </MenuItem>
        <MenuItem
          isOpen={isOpen}
          delay="0.12s"
          onClick={() => {
            toggleMenu();
            setStateCierreCaja(true);
          }}
        >
          <Icon icon="lucide:lock" />
          <Text>Cerrar caja</Text>
        </MenuItem>
        <MenuItem isOpen={isOpen} delay="0.18s" onClick={mutateEliminarVenta}>
          <Icon icon="lucide:trash-2" />
          <Text>Eliminar venta</Text>
        </MenuItem>
      </MenuItems>
      <FloatingButton onClick={toggleMenu}>
        <Icon icon="lucide:chevron-up" fontSize={28} />
      </FloatingButton>
    </Container>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(14px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  bottom: 95px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 40;
  @media ${Device.desktop} {
    display: none;
  }
`;

const FloatingButton = styled.button`
  border: 1px solid ${({ theme }) => theme.color2};
  background-color: ${({ theme }) => theme.bgcards};
  color: ${({ theme }) => theme.text};
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-out;
  &:hover {
    border-color: rgba(139, 92, 246, 0.35);
    transform: translateY(-2px);
  }
`;

const MenuItems = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  ${({ isOpen }) => !isOpen && "display: none;"}
`;

const MenuItem = styled.div`
  background-color: ${({ theme }) => theme.bgcards};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 999px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transition: all 0.2s ease-out;
  opacity: 0;
  animation: ${({ isOpen }) => (isOpen ? slideUp : "none")} 0.25s ease forwards;
  animation-delay: ${({ delay }) => delay};
  svg {
    color: #8b5cf6;
    font-size: 18px;
  }
  &:hover {
    border-color: rgba(139, 92, 246, 0.35);
    transform: translateY(-1px);
  }
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
