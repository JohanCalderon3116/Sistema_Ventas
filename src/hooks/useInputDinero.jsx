import { useState } from "react";

export function useInputDinero(valorInicial = "") {
  const [display, setDisplay] = useState(valorInicial);

  const formatear = (valorCrudo) => {
    let limpio = valorCrudo.replace(/[^\d,]/g, "");
    const partes = limpio.split(",");
    if (partes.length > 2) {
      limpio = partes[0] + "," + partes.slice(1).join("");
    }
    const [entero, decimal] = limpio.split(",");
    const enteroFormateado = entero
      ? new Intl.NumberFormat("es-CO").format(Number(entero))
      : "";
    if (limpio.includes(",")) {
      return `${enteroFormateado},${decimal ?? ""}`;
    }
    return enteroFormateado;
  };

  const handleChange = (e) => {
    setDisplay(formatear(e.target.value));
  };

  const valorNumerico = () => {
    if (!display) return 0;
    const limpio = display.replace(/\./g, "").replace(",", ".");
    return parseFloat(limpio) || 0;
  };

  return { display, handleChange, valorNumerico, setDisplay };
}
