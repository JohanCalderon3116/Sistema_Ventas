import { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { userAuth } from "../context/AuthContext";
import { useAuthStore } from "../store/AuthStore";
import { Spinner1 } from "../components/moleculas/Spinner1";

// Respaldo: si tras cerrar sesión el Login no llegara a montarse, se libera el overlay.
const TIEMPO_MAXIMO_OVERLAY_SALIDA_MS = 2500;

/**
 * Compuerta de autenticación:
 * - Mientras Supabase verifica la sesión NO renderiza ni Home ni Login,
 *   sino el Spinner1 con el fondo y colores del tema activo.
 * - Durante el cierre de sesión superpone Spinner1 para que el cambio
 *   sea suave y fluido respetando el tema.
 */
export const AuthGate = ({ children }) => {
  const { user, isCheckingAuth } = userAuth();
  const isSigningOut = useAuthStore((state) => state.isSigningOut);
  const finalizarCierreSesion = useAuthStore(
    (state) => state.finalizarCierreSesion,
  );

  useEffect(() => {
    if (!isSigningOut || user) return;
    const timer = setTimeout(
      finalizarCierreSesion,
      TIEMPO_MAXIMO_OVERLAY_SALIDA_MS,
    );
    return () => clearTimeout(timer);
  }, [isSigningOut, user, finalizarCierreSesion]);

  const mostrarPantallaCarga = isCheckingAuth || isSigningOut;

  return (
    <>
      {!isCheckingAuth && children}
      <AnimatePresence>
        {mostrarPantallaCarga && (
          <Overlay
            key="spinner1-auth-gate"
            initial={!isCheckingAuth ? { opacity: 0 } : false}
            animate={{
              opacity: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <Spinner1
              texto={
                isSigningOut ? "Cerrando sesión..." : "Verificando sesión..."
              }
            />
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: ${({ theme }) => theme.bgtotal};
`;
