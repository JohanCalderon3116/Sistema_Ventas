import styled from "styled-components";
import {
  MenuMovil,
  Sidebar,
  Spinner1,
  Toogle,
  useCierreCajaStore,
  useEliminarVentasIncompletasMutateStack,
  useEmpresaStore,
  usePermisosStore,
  userAuth,
  useSucursalesStore,
  useUsuariosStore,
} from "../index";
import { useEffect, useState } from "react";
import { Device } from "../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mostrarusuarios } = useUsuariosStore();
  const { mostrarempresa } = useEmpresaStore();
  const { mostrarSucursalCajaAsignada } = useAsignacionCajaSucursalesStore();
  const { user } = userAuth();
  const id_auth = user?.id;
  const { mostrarPermisosGlobales } = usePermisosStore();
  const [stateMenu, setStateMenu] = useState(false);
  const { dataCierreCaja } = useCierreCajaStore();

  const {
    refetch: refetchUsuarios,
    data: datausuarios,
    isLoading: isLoadingUsuarios,
    error: errorUsuarios,
  } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: () =>
      mostrarusuarios({
        id_auth: id_auth,
      }),
    refetchOnWindowFocus: false,
    enabled: !!id_auth,
  });
  const { mutate, isPending } = useEliminarVentasIncompletasMutateStack();
  const {
    data: dataSucursales,
    isLoading: isLoadingSucursales,
    error: errorSucursales,
  } = useQuery({
    queryKey: ["mostrar sucursales caja asignadas", datausuarios?.id],
    queryFn: () =>
      mostrarSucursalCajaAsignada({ id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
    refetchOnWindowFocus: false,
  });
  const { isLoading: isLoadingEmpresa, error: errorEmpresa } = useQuery({
    queryKey: ["mostrar empresa", datausuarios?.id],
    queryFn: () => mostrarempresa({ _id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (datausuarios?.id && dataCierreCaja?.id) {
      mutate();
    }
  }, [datausuarios?.id, dataCierreCaja?.id]);

  if (datausuarios == null) {
    refetchUsuarios();
  }

  const isLoading =
    isLoadingEmpresa || isLoadingSucursales || isLoadingUsuarios;
  const error = errorEmpresa;
  if (isLoading) {
    return <Spinner1></Spinner1>;
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
