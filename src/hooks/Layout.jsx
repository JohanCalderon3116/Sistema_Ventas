import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  MenuMovil,
  Sidebar,
  Spinner1,
  Toogle,
  useMostrarEmpresaQueryStack,
  useMostrarSucursalesAsignadsQueryStack,
  useMostrarUsuariosQueryStack,
} from "../index";
import { useEffect, useState } from "react";
import { Device } from "../styles/breakpoints";
import { IndicadorConexion } from "../components/moleculas/IndicadorConexion";
import { userAuth } from "../context/AuthContext";
import { supabase } from "../supabase/supabase.config";
import { useUsuariosStore } from "../store/UsuariosStore";

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stateMenu, setStateMenu] = useState(false);
  const location = useLocation();
  const { user } = userAuth();
  const setUsuariosEnLinea = useUsuariosStore(
    (state) => state.setUsuariosEnLinea,
  );
  const {
    refetch: refetchUsuarios,
    data: datausuarios,
    isLoading: isLoadingUsuarios,
  } = useMostrarUsuariosQueryStack();
  const { isLoading: isLoadingSucursales } =
    useMostrarSucursalesAsignadsQueryStack();
  const { isLoading: isLoadingEmpresa } = useMostrarEmpresaQueryStack();

  useEffect(() => {
    if (user?.id && (!datausuarios?.id || datausuarios?.id_auth !== user.id)) {
      refetchUsuarios();
    }
  }, [user?.id, datausuarios?.id, datausuarios?.id_auth, refetchUsuarios]);

  const usuarioSincronizado = Boolean(
    user?.id && datausuarios?.id && datausuarios?.id_auth === user.id,
  );

  useEffect(() => {
    if (!usuarioSincronizado || !datausuarios?.id) return;

    const userId = Number(datausuarios.id);
    setUsuariosEnLinea({ [userId]: true });

    const channel = supabase.channel("presencia-usuarios-pos", {
      config: {
        presence: {
          key: String(userId),
        },
      },
    });

    const sincronizarPresencia = () => {
      const state = channel.presenceState();
      const conectados = { [userId]: true };
      Object.keys(state).forEach((key) => {
        const idNum = Number(key);
        if (!Number.isNaN(idNum)) {
          conectados[idNum] = true;
        }
        const lista = state[key] || [];
        lista.forEach((item) => {
          if (item?.id_usuario) {
            conectados[Number(item.id_usuario)] = true;
          }
        });
      });
      setUsuariosEnLinea(conectados);
    };

    channel
      .on("presence", { event: "sync" }, sincronizarPresencia)
      .on("presence", { event: "join" }, sincronizarPresencia)
      .on("presence", { event: "leave" }, sincronizarPresencia)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id_usuario: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [usuarioSincronizado, datausuarios?.id, setUsuariosEnLinea]);

  const isLoading =
    !usuarioSincronizado ||
    isLoadingEmpresa ||
    isLoadingSucursales ||
    isLoadingUsuarios;

  // Sin sesión no se dibuja la estructura (Sidebar/menú): ProtectedRoute
  // se encarga de redirigir al Login sin mostrar el "esqueleto" del Home.
  if (!user) return children;

  if (isLoading) return <Spinner1 />;

  return (
    <Container className={sidebarOpen ? "active" : ""}>
      <IndicadorConexion></IndicadorConexion>
      <section className="contentSidebar">
        <Sidebar
          state={sidebarOpen}
          setState={() => setSidebarOpen(!sidebarOpen)}
        />
      </section>
      <section className="contentMenuambur">
        <Toogle state={stateMenu} setstate={() => setStateMenu(!stateMenu)} />
        {stateMenu && <MenuMovil setState={() => setStateMenu(!stateMenu)} />}
      </section>
      <Containerbody>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </Containerbody>
    </Container>
  );
};

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bgtotal};
  transition: 0.1s ease-in-out;
  color: ${({ theme }) => theme.text};
  .contentSidebar {
    display: none;
    height: 100%;
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
      height: 100%;
    }
    .contentMenuambur {
      display: none;
    }
  }
`;

const Containerbody = styled.section`
  grid-column: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bgtotal};
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
    grid-column: 2;
  }
`;
