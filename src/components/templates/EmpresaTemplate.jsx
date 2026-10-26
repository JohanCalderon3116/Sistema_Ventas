import { NavLink, Outlet } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { Btn1 } from "../moleculas/Btn1";
import { Toaster } from "sonner";
import { useCerrarSesion } from "../../hooks/useCerrarSesion";
import Swal from "sweetalert2";

export const EmpresaTemplate = () => {
  const cerrarSesion = useCerrarSesion();
  const theme = useTheme();
  function cerrarseion() {
    Swal.fire({
      title: "¿Estás seguro(a)?",
      text: "Una vez cerrada la sesión, tendrá que volver a iniciar sesión",
      iconHtml:
        '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
      showCancelButton: true,
      confirmButtonColor: "#18181B",
      cancelButtonColor: "#71717A",
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
  return (
    <Main>
      <Toaster richColors position="top-center" />
      <PageContainer>
        <Content>
          <Outlet />
        </Content>
        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Empresa</SidebarTitle>
            <SidebarItem to="empresabasicos">Básico</SidebarItem>
            <SidebarItem to="monedaconfig">Moneda</SidebarItem>
          </SidebarSection>
          <Btn1
            funcion={cerrarseion}
            bgcolor="transparent"
            color={({ theme }) => theme.text}
            titulo="Cerrar sesión"
          />
        </Sidebar>
      </PageContainer>
    </Main>
  );
};

const Main = styled.div`
  justify-content: center;
  width: 100%;
  display: flex;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  justify-content: center;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (min-width: 768px) {
    width: 250px;
    order: 2;
  }
`;

const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
  margin: 4px 0;
  transition: all 0.2s ease-out;
  position: relative;
  text-decoration: none;
  color: ${(props) => props.theme.colorSubtitle};
  height: 48px;
  border: 1px solid transparent;
  &:hover {
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.bgAlpha};
  }
  &.active {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.22);
    color: #8b5cf6;
    font-weight: 600;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  margin: 20px;
`;

const SidebarTitle = styled.h3`
  margin-bottom: 16px;
  font-size: 1.15em;
  font-weight: 700;
`;

const SidebarSection = styled.div`
  margin-bottom: 20px;
  border-radius: 14px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  padding: 14px;
`;
