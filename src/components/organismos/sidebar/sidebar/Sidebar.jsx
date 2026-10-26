import styled, { useTheme } from "styled-components";
import {
  LinksArray,
  SecondarylinksArray,
  ToggleTema,
  v,
} from "../../../../index";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { useCerrarSesion } from "../../../../hooks/useCerrarSesion";

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

export function Sidebar({ state, setState }) {
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
      customClass: {
        popup: "softcreate-swal-popup",
        confirmButton: "softcreate-swal-confirm",
        cancelButton: "softcreate-swal-cancel",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        cerrarSesion();
      }
    });
  }
  return (
    <Main $isopen={state.toString()}>
      <SidebarButton
        $isopen={state.toString()}
        onClick={() => setState(!state)}
      >
        <Icon icon="lucide:chevron-right" />
      </SidebarButton>
      <SidebarContainer
        $isopen={state.toString()}
        className={state ? "active" : ""}
      >
        <LogoContent $isopen={state.toString()}>
          <LogoWrapper $isopen={state.toString()}>
            <img src={v.logo} alt="SoftCreate POS" />
          </LogoWrapper>
          <LogoTitle $isopen={state.toString()}>SoftCreate POS</LogoTitle>
        </LogoContent>
        {LinksArray.map(({ icon, label, to }) => (
          <LinkContainer key={label}>
            <StyledNavLink
              to={to}
              className={({ isActive }) => `Links ${isActive ? "active" : ""}`}
            >
              <LinkContent $isopen={state.toString()}>
                <StyledIcon className="Linkicon" icon={icon} />{" "}
                <Label $isopen={state.toString()}>{label}</Label>{" "}
              </LinkContent>{" "}
            </StyledNavLink>{" "}
          </LinkContainer>
        ))}{" "}
        <Divider />
        {SecondarylinksArray.map(({ icon, label, to, color }) => (
          <LinkContainer key={label}>
            <StyledNavLink
              to={to}
              className={({ isActive }) => `Links ${isActive ? "active" : ""}`}
            >
              <LinkContent $isopen={state.toString()}>
                <StyledIcon
                  className="Linkicon"
                  icon={icon}
                  $customcolor={color}
                />
                <Label $isopen={state.toString()}>{label}</Label>
              </LinkContent>
            </StyledNavLink>
          </LinkContainer>
        ))}
        <LinkContainer>
          <LogoutButton className="Links" onClick={cerrarSesionConfirmacion}>
            <LinkContent $isopen={state.toString()}>
              <StyledIcon
                className="Linkicon"
                icon="lucide:log-out"
              />
              <Label $isopen={state.toString()}>Cerrar sesión</Label>
            </LinkContent>
          </LogoutButton>
        </LinkContainer>
        <ThemeContainer $isopen={state.toString()}>
          <ToggleTema />
        </ThemeContainer>
      </SidebarContainer>
    </Main>
  );
}

const LogoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $isopen }) =>
    $isopen === "true" ? "flex-start" : "center"};
  width: 100%;
  min-height: 72px;
  padding: ${({ $isopen }) =>
    $isopen === "true" ? "0 16px 25px" : "0 0 25px"};
  overflow: hidden;
  transition:
    justify-content 0.3s ease,
    padding 0.3s ease;
`;

const LogoWrapper = styled.div`
  flex-shrink: 0;
  width: 56px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease-out;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: ${({ theme }) =>
      isDarkTheme(theme)
        ? "drop-shadow(0 0 8px rgba(139, 92, 246, 0.25))"
        : "none"};
  }
`;

const LogoTitle = styled.h2`
  margin: 0 0 0 12px;
  white-space: nowrap;
  color: ${({ theme }) => theme.text};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  display: ${({ $isopen }) => ($isopen === "true" ? "block" : "none")};
  opacity: ${({ $isopen }) => ($isopen === "true" ? 1 : 0)};
  transform: ${({ $isopen }) =>
    $isopen === "true" ? "translateX(0)" : "translateX(-10px)"};
  transition:
    opacity 0.25s ease,
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 88px;
  height: 100vh;
  min-height: 100vh;
  padding-top: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bgtotal};
  border-right: 1px solid ${({ theme }) => theme.color2};
  transition:
    width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.25s ease,
    border-color 0.25s ease;
  &.active {
    width: 260px;
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colorScroll};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const LinkContainer = styled.div`
  margin: 6px 10px;
  position: relative;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  text-decoration: none;
  color: ${({ theme }) => theme.colorSubtitle};
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s ease-out;
  &:hover {
    background: ${({ theme }) => theme.bgAlpha};
    color: ${({ theme }) => theme.text};
  }
  &.active {
    background: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255, 255, 255, 0.09)" : "rgba(18, 18, 22, 0.07)"};
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255, 255, 255, 0.16)" : "rgba(18, 18, 22, 0.14)"};
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    box-shadow: inset 3px 0 0 ${({ theme }) => theme.text};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colorSubtitle};
  cursor: pointer;
  transition: all 0.2s ease-out;
  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }
`;

const LinkContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: ${({ $isopen }) =>
    $isopen === "true" ? "flex-start" : "center"};
  width: 100%;
  height: 100%;
  gap: ${({ $isopen }) => ($isopen === "true" ? "14px" : "0")};
  padding: ${({ $isopen }) => ($isopen === "true" ? "0 14px" : "0")};
  overflow: hidden;
  transition:
    justify-content 0.25s ease,
    gap 0.25s ease,
    padding 0.25s ease;
`;

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  width: 20px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: currentColor;
  transition:
    transform 0.2s ease-out,
    color 0.2s ease-out;
`;

const Label = styled.span`
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  display: ${({ $isopen }) => ($isopen === "true" ? "inline-block" : "none")};
  opacity: ${({ $isopen }) => ($isopen === "true" ? 1 : 0)};
  transform: ${({ $isopen }) =>
    $isopen === "true" ? "translateX(0)" : "translateX(-8px)"};
  transition:
    opacity 0.2s ease 0.05s,
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Divider = styled.div`
  width: calc(100% - 24px);
  height: 1px;
  margin: 16px auto;
  background: ${({ theme }) => theme.color2};
`;

const ThemeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0 30px;

  > * {
    margin: 0 !important;
  }
`;

const Main = styled.div``;

const SidebarButton = styled.button`
  position: fixed;
  top: 67px;
  left: 71px;
  z-index: 30;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color2};
  background: ${({ theme }) => theme.bgcards};
  color: ${({ theme }) => theme.text};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transform: ${({ $isopen }) =>
    $isopen === "true" ? "translateX(172px) rotate(180deg)" : "translateX(0)"};
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.2s ease-out,
    border-color 0.2s ease-out;
  &:hover {
    border-color: ${({ theme }) => theme.text};
  }
`;
