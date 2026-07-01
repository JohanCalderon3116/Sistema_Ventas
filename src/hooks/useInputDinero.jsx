import { useState } from "react";

export function useInputDinero(valorInicial = "") {
  const [display, setDisplay] = useState(valorInicial);

  const formatear = (valorCrudo) => {
    // deja solo dígitos y una coma decimal
    let limpio = valorCrudo.replace(/[^\d,]/g, "");

    // evita más de una coma
    const partes = limpio.split(",");
    if (partes.length > 2) {
      limpio = partes[0] + "," + partes.slice(1).join("");
    }

    const [entero, decimal] = limpio.split(",");

    // separador de miles con punto sobre la parte entera
    const enteroFormateado = entero
      ? new Intl.NumberFormat("es-CO").format(Number(entero))
      : "";

    // si el usuario ya escribió la coma, la reconstruimos (aunque esté vacía después)
    if (limpio.includes(",")) {
      return `${enteroFormateado},${decimal ?? ""}`;
    }
    return enteroFormateado;
  };

  const handleChange = (e) => {
    setDisplay(formatear(e.target.value));
  };

  // valor real, listo para enviar a la BD
  const valorNumerico = () => {
    if (!display) return 0;
    const limpio = display.replace(/\./g, "").replace(",", ".");
    return parseFloat(limpio) || 0;
  };

  return { display, handleChange, valorNumerico, setDisplay };
}
