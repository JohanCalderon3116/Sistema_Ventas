import styled from "styled-components";
import {
  MenuMovil,
  Sidebar,
  Spinner1,
  Toogle,
  useCierreCajaStore,
  useEliminarVentasIncompletasMutateStack,
  useMostrarEmpresaQueryStack,
  useMostrarSucursalesAsignadsQueryStack,
  useMostrarUsuariosQueryStack,
} from "../index";
import { useEffect, useState } from "react";
import { Device } from "../styles/breakpoints";

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stateMenu, setStateMenu] = useState(false);
  const { dataCierreCaja } = useCierreCajaStore();

  const {
    refetch: refetchUsuarios,
    data: datausuarios,
    isLoading: isLoadingUsuarios,
  } = useMostrarUsuariosQueryStack();

  const { mutate } = useEliminarVentasIncompletasMutateStack();
  const { isLoading: isLoadingSucursales } = useMostrarSucursalesAsignadsQueryStack();
  const { isLoading: isLoadingEmpresa } = useMostrarEmpresaQueryStack();

  useEffect(() => {
    if (!datausuarios) refetchUsuarios();
  }, [datausuarios]);

  useEffect(() => {
    if (datausuarios?.id && dataCierreCaja?.id) {
      mutate();
    }
  }, [datausuarios?.id, dataCierreCaja?.id]);

  const isLoading = isLoadingEmpresa || isLoadingSucursales || isLoadingUsuarios;

  if (isLoading) return <Spinner1 />;

  return (
    <Container className={sidebarOpen ? "active" : ""}>
      <section className="contentSidebar">
        <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)} />
      </section>
      <section className="contentMenuambur">
        <Toogle state={stateMenu} setstate={() => setStateMenu(!stateMenu)} />
        {stateMenu && <MenuMovil setState={() => setStateMenu(!stateMenu)} />}
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
  .contentSidebar { display: none; }
  .contentMenuambur { position: absolute; }
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
    &.active { grid-template-columns: 260px 1fr; }
    .contentSidebar { display: initial; }
    .contentMenuambur { display: none; }
  }
`;

const Containerbody = styled.section`
  grid-column: 1;
  width: 100%;
  @media ${Device.tablet} { grid-column: 2; }
`;