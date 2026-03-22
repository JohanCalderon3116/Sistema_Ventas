import styled from "styled-components";
import {
  MenuMovil,
  Sidebar,
  Spinner1,
  Toogle,
  useEmpresaStore,
  useSucursalesStore,
  useUsuariosStore,
} from "../index";
import { useState } from "react";
import { Device } from "../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";
export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { datausuarios, mostrarusuarios } = useUsuariosStore();
  const { mostrarempresa } = useEmpresaStore();
  const { mostrarSucursalesAsignadas } = useSucursalesStore();
  const [stateMenu, setStateMenu] = useState(false);

  const { refetch: refetchUsuarios } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: mostrarusuarios,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["mostrar sucursales asignadas", datausuarios?.id],
    queryFn: () => mostrarSucursalesAsignadas({ id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
    refetchOnWindowFocus: false,
  });
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar empresa", datausuarios?.id],
    queryFn: () => mostrarempresa({ _id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
    refetchOnWindowFocus: false,
  });

  if (datausuarios == null) {
    refetchUsuarios();
  }

  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  if (error) {
    return <span>error...</span>;
  }
  return (
    <Container className={sidebarOpen ? "active" : ""}>
      <section className="contentSidebar">
        <Sidebar
          state={sidebarOpen}
          setState={() => setSidebarOpen(!sidebarOpen)}
        ></Sidebar>
      </section>
      <section className="contentMenuambur">
        <Toogle
          state={stateMenu}
          setstate={() => setStateMenu(!stateMenu)}
        ></Toogle>
        {stateMenu && (
          <MenuMovil setState={() => setStateMenu(!stateMenu)}></MenuMovil>
        )}
      </section>
      <Containerbody>{children}</Containerbody>
    </Container>
  );
};

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  transition: 0.1s ease-in-out;
  color: ${({ theme }) => theme.text};

  .contentSidebar {
    display: none;
  }
  .contentMenuambur {
    position: absolute;
  }
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
    &.active {
      grid-template-columns: 260px 1fr;
    }
    .contentSidebar {
      display: initial;
    }
    .contentMenuambur {
      display: none;
    }
  }
`;
const Containerbody = styled.section`
  grid-column: 1;
  width: 100%;
  @media ${Device.tablet} {
    grid-column: 2;
  }
`;
