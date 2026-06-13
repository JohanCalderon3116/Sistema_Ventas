import styled from "styled-components";
import TicketVenta from "../../../reports/TicketVenta";
import { useEffect, useState } from "react";
import {
  BasicosConfig,
  Btn1,
  IngresoCobro,
  Reloj,
  useClientesProveedoresStore,
  useEmpresaStore,
  useVentasStore,
} from "../../..";
import { Icon } from "@iconify/react";

export const VisorTicketVenta = ({ setState }) => {
  const [base64, setBase64] = useState("");
  const { items, tipocobro, total } = useVentasStore();
  const { dataempresa: dataempresainfo } = useEmpresaStore();
  const { cliproItemSelect } = useClientesProveedoresStore();
  const onGenerateTicket = async (output) => {
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const fechaFormateada = ahora.toLocaleDateString();
    const dataempresa = {
      logo: "data:image/jpeg;base64,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",
      productos: items,
      tipo_de_pago: tipocobro,
      monto_total: total,
      nombre: dataempresainfo.nombre,
      hora: horaFormateada,
      fecha: fechaFormateada,
      nombre_cliente: cliproItemSelect?.nombres,
      direccion: cliproItemSelect?.direccion,
    };
    const response = await TicketVenta(output, dataempresa);
    console.log(productos);
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
