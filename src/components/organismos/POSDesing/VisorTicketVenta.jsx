import styled from "styled-components";
import TicketVenta from "../../../reports/TicketVenta";
import { useEffect, useState } from "react";
import {
  BasicosConfig,
  Btn1,
  IngresoCobro,
  Reloj,
  useClientesProveedoresStore,
  useDetalleVentasStore,
  useEmpresaStore,
  useProductosStore,
  useUsuariosStore,
  useVentasStore,
} from "../../..";
import { Icon } from "@iconify/react";

export const VisorTicketVenta = ({ setState }) => {
  const [base64, setBase64] = useState("");
  const { items, tipocobro, idventa, dataventas } = useVentasStore();
  const { dataempresa } = useEmpresaStore();
  const { cliproItemSelect } = useClientesProveedoresStore();
  const { datausuarios } = useUsuariosStore();
  const { ProductosItemSelect } = useProductosStore();
  const { mostrardetalleventa, total } = useDetalleVentasStore();
  const onGenerateTicket = async (output) => {
    const items = await mostrardetalleventa({ id_venta: idventa });
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const fechaFormateada = ahora.toLocaleDateString();
    const dataenv = {
      hora: horaFormateada,
      fecha: fechaFormateada,
      logo: dataempresa.logo,
      nombre: dataempresa.nombre,
      direccion_empresa: dataempresa.direccion_fiscal,
      pais: dataempresa.pais,
      id_venta: dataventas?.nro_comprobante,
      nombre_usuario: datausuarios?.nombres,
      nombre_cliente: cliproItemSelect?.nombres || "-",
      cc: cliproItemSelect?.identificador_nacional || "-",
      direccion_cliente: cliproItemSelect.direccion || "-",
      codigo_producto: ProductosItemSelect?.codigo_barra,
      productos: items,
      tipo_de_pago: tipocobro,
      monto_total: total,
      pie_pagina: dataempresa?.pie_pagina_ticket,
    };
    const response = await TicketVenta(output, dataenv);
    if (output === "b64") {
      setBase64(response?.content ?? "");
    }
  };
  return (
    <Container>
      <ContentTicket>
        <span className="afuera">
          {" "}
          Para poder "Ver" o "Descargar" el ticket <br></br> Haz click en uno de
          los botones :p{" "}
        </span>
        <article className="contentverticket" onClick={setState}>
          <span className="ocultar">Ocultar Botones :p</span>
          <Icon icon="fluent-emoji:monkey-face" className="icon"></Icon>
        </article>
        <Btn1
          titulo="Imprimir ticket"
          funcion={() => onGenerateTicket("print")}
        ></Btn1>
        <Btn1
          titulo="Generar ticket"
          funcion={() => onGenerateTicket("b64")}
        ></Btn1>
      </ContentTicket>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  inset: 0; /* Ocupa todo el espacio disponible del padre */
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bgtotal || "rgba(0,0,0,0.5)"};
  backdrop-filter: blur(
    5px
  ); /* Añade un desenfoque al fondo para resaltar el visor */
  padding: 20px;
`;

const ContentTicket = styled.div`
  background-color: ${({ theme }) => theme.bg};
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  text-align: center;
  max-width: 400px;
  width: 100%;

  .afuera {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text || "#333"};
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .contentverticket {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 12px;
    background: ${({ theme }) => theme.bg3 || "#f0f0f0"};
    transition:
      transform 0.2s ease,
      background 0.2s ease;
    border: 2px dashed ${({ theme }) => theme.color2 || "#ccc"};

    &:hover {
      transform: scale(1.05);
      background: ${({ theme }) => theme.bg4 || "#e0e0e0"};
    }

    .ocultar {
      font-size: 0.9rem;
      font-weight: 700;
      color: ${({ theme }) => theme.text || "#555"};
    }

    .icon {
      font-size: 2rem;
    }
  }

  /* Contenedor para los botones si quieres que estén juntos */
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
`;
