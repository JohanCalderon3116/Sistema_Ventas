import { useState, useEffect } from "react";

export function useFormattedDate() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const fechaActual = new Date();
    //2024-19-09 45.45:UTC45200
    const offset = fechaActual.getTimezoneOffset() * 60000;
    const fechaLocal = new Date(fechaActual - offset)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    setFormattedDate(fechaLocal);
  }, []);

  return formattedDate;
}
export function formatearFechaColombia(fechaISO) {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  const partes = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(fecha);

  const obtener = (tipo) => partes.find((p) => p.type === tipo)?.value;

  return `${obtener("year")}/${obtener("month")}/${obtener("day")} ${obtener("hour")}:${obtener("minute")}:${obtener("second")}`;
}
