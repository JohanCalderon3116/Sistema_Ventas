import styled from "styled-components";
import {
  Sidebar,
  Spinner1,
  Toogle,
  useEmpresaStore,
  useUsuariosStore,
} from "../index";
import { useState } from "react";
import { Device } from "../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";
export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { datausuarios, mostrarusuarios } = useUsuariosStore();
  const { mostrarempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: mostrarusuarios,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["mostrar empresa", datausuarios?.id],
    queryFn: () => mostrarempresa({ _id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
    refetchOnWindowFocus: false,
  });
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
        <Toogle></Toogle>
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
