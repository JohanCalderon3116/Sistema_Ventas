import styled, { keyframes, useTheme } from "styled-components";
import {
  LinksArray,
  SecondarylinksArray,
  ToggleTema,
} from "../../../../index";
import { v } from "../../../../styles/variables";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import React from "react";
import { useCerrarSesion } from "../../../../hooks/useCerrarSesion";

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

export const MenuMovil = ({ setState }) => {
  const [state, setstate] = React.useState(true);
  const cerrarSesion = useCerrarSesion();
  const theme = useTheme();
  const isDark = isDarkTheme(theme);

  function cerrarSesionConfirmacion() {
    Swal.fire({
      title: "¿Estás seguro(a)?",
      text: "Una vez cerrada la sesión, tendrá que volver a iniciar sesión.",
      iconHtml:
        '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: isDark ? "#27272F" : "#71717A",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: theme.bgcards,
      color: theme.text,
    }).then(async (result) => {
      if (result.isConfirmed) {
        cerrarSesion();
      }
    });
  }
  function cerrarMenu() {
    setstate(false);
    if (typeof setState === "function") {
      setState();
    }
  }
  return (
    <Overlay $isopen={state.toString()}>
      <Backdrop $isopen={state.toString()} onClick={cerrarMenu} />
      <Drawer $isopen={state.toString()}>
        <DrawerHeader>
          <LogoContent>
            <LogoWrapper>
              <img src={v.logo} alt="SoftCreate POS" />
            </LogoWrapper>
            <LogoTitle>SoftCreate POS</LogoTitle>
          </LogoContent>
          <CloseButton onClick={cerrarMenu} aria-label="Cerrar menú">
            <Icon icon="lucide:x" />
          </CloseButton>
        </DrawerHeader>
        <LinksWrapper>
          {LinksArray.map(({ icon, label, to }) => (
            <MobileLinkContainer key={label}>
              <StyledNavLink
                to={to}
                onClick={cerrarMenu}
                className={({ isActive }) =>
                  `Links ${isActive ? "active" : ""}`
                }
              >
                <MobileLinkContent>
                  <MobileIcon className="Linkicon" icon={icon} />
                  <span>{label}</span>
                </MobileLinkContent>
              </StyledNavLink>
            </MobileLinkContainer>
          ))}
          <Divider />
          {SecondarylinksArray.map(({ icon, label, to, color }) => (
            <MobileLinkContainer key={label}>
              <StyledNavLink
                to={to}
                onClick={cerrarMenu}
                className={({ isActive }) =>
                  `Links ${isActive ? "active" : ""}`
                }
              >
                <MobileLinkContent>
                  <MobileIcon
                    className="Linkicon"
                    icon={icon}
                    $customcolor={color}
                  />
                  <span>{label}</span>
                </MobileLinkContent>
              </StyledNavLink>
            </MobileLinkContainer>
          ))}
          <MobileLinkContainer>
            <LogoutButton onClick={cerrarSesionConfirmacion}>
              <MobileLinkContent>
                <MobileIcon icon="lucide:log-out" />
                <span>Cerrar sesión</span>
              </MobileLinkContent>
            </LogoutButton>
          </MobileLinkContainer>
        </LinksWrapper>
        <ThemeContainer>
          <ToggleTema />
        </ThemeContainer>
      </Drawer>
    </Overlay>
  );
};
const itemIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: ${({ $isopen }) => ($isopen === "true" ? "auto" : "none")};
  visibility: ${({ $isopen }) => ($isopen === "true" ? "visible" : "hidden")};
  transition: visibility 0s linear
    ${({ $isopen }) => ($isopen === "true" ? "0s" : ".4s")};
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  opacity: ${({ $isopen }) => ($isopen === "true" ? 1 : 0)};
  transition: opacity 0.25s ease;
`;

const Drawer = styled.aside`
  position: relative;
  z-index: 2;
  width: min(88%, 340px);
  height: 100%;
  overflow-y: auto;
  padding: 20px 16px 30px;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  border-right: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 20px 0 60px rgba(0, 0, 0, 0.2);
  transform: ${({ $isopen }) =>
    $isopen === "true" ? "translateX(0)" : "translateX(-105%)"};
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.25s ease,
    border-color 0.25s ease;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 26px;
`;

const LogoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 36px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: ${({ theme }) =>
      isDarkTheme(theme)
        ? "drop-shadow(0 0 6px rgba(255, 255, 255, 0.16)) brightness(1.08)"
        : "none"};
  }
`;

const LogoTitle = styled.h2`
  margin: 0;
  white-space: nowrap;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.color2};
  background: ${({ theme }) => theme.bgAlpha};
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease-out;
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MobileLinkContainer = styled.div`
  animation: ${itemIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  width: 100%;
  min-height: 48px;
  border-radius: 10px;
  text-decoration: none;
  color: ${({ theme }) => theme.colorSubtitle};
  border: 1px solid transparent;
  transition: all 0.2s ease-out;
  &:hover {
    background: ${({ theme }) => theme.bgAlpha};
    color: ${({ theme }) => theme.text};
  }
  &.active {
    background: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255, 255, 255, 0.09)" : "rgba(18, 18, 22, 0.07)"};
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255, 255, 255, 0.16)" : "rgba(18, 18, 22, 0.14)"};
    box-shadow: inset 3px 0 0 ${({ theme }) => theme.text};
    font-weight: 600;
  }
`;

const MobileLinkContent = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  font-weight: 500;
  font-size: 15px;
  span {
    white-space: nowrap;
  }
`;

const MobileIcon = styled(Icon)`
  flex-shrink: 0;
  width: 20px;
  min-width: 20px;
  height: 20px;
  color: currentColor;
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  min-height: 48px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colorSubtitle};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease-out;
  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 16px 0;
  background: ${({ theme }) => theme.color2};
`;

const ThemeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 28px 0 10px;
`;
