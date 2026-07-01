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
          bgcolor={v.colorPrincipal}
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
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    position: relative;
    width: 400px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 30px 36px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;

    .icono-alerta {
      color: #ddd319;
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
