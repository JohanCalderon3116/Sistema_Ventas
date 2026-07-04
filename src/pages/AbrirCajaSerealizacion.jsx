import { Icon } from "@iconify/react";
import styled from "styled-components";
import { Btn1 } from "../components/moleculas/Btn1";
import { v } from "../styles/variables";

export const AbrirCajaSerealizacion = ({ onClose }) => {
  return (
    <Container>
      <div className="sub-contenedor">
        <Icon
          icon="line-md:alert-circle"
          width="60"
          height="60"
          className="icono-alerta"
        />
        <h2>Caja cerrada</h2>
        <p>
          Para ver y gestionar las serializaciones de comprobantes, primero
          debes abrir la caja.
        </p>
        <Btn1
          titulo="De acuerdo"
          bgcolor="#3300E3"
          width="100%"
          funcion={onClose}
        ></Btn1>
      </div>
    </Container>
  );
};

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    content: "";
    position: relative;
    width: 400px;
    max-width: 85%;
    border-radius: 20px;
    background: "#fff";
    background-color: ${({ theme }) => theme.bg2};
    /* box-shadow: -10px 15px 30px rgba(255, 255, 255, 0.4); */
    padding: 30px 36px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 2px solid ${({ theme }) => theme.color1};
    gap: 15px;

    .icono-alerta {
      color: #6d05e5;
    }

    h2 {
      font-size: 22px;
      font-weight: 600;
    }

    p {
      font-size: 16px;
      color: ${({ theme }) => theme.textLight || "#888"};
      line-height: 1.4;
    }
  }
`;
