import { useEffect, useState } from "react";

// "estable" | "baja" | "muy_baja" | "sin_conexion"
export function useEstadoConexion() {
  const [estado, setEstado] = useState("estable");

  useEffect(() => {
    function evaluarConexion() {
      if (!navigator.onLine) {
        setEstado("sin_conexion");
        return;
      }

      const conn =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (!conn) {
        setEstado("estable");
        return;
      }

      const { effectiveType, downlink } = conn;

      if (effectiveType === "slow-2g" || (downlink != null && downlink < 0.15)) {
        setEstado("muy_baja");
      } else if (
        effectiveType === "2g" ||
        effectiveType === "3g" ||
        (downlink != null && downlink < 1)
      ) {
        setEstado("baja");
      } else {
        setEstado("estable");
      }
    }

    evaluarConexion();

    window.addEventListener("online", evaluarConexion);
    window.addEventListener("offline", evaluarConexion);

    const conn =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    conn?.addEventListener("change", evaluarConexion);

    return () => {
      window.removeEventListener("online", evaluarConexion);
      window.removeEventListener("offline", evaluarConexion);
      conn?.removeEventListener("change", evaluarConexion);
    };
  }, []);

  return estado;
}