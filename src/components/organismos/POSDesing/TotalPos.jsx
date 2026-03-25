import styled from "styled-components";
import { Btn1 } from "../../moleculas/Btn1";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import {
  useCartVentasStore,
  useDetalleVentasStore,
  useEmpresaStore,
} from "../../../index";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
export const TotalPos = () => {
  const { total, setStatePantallaCobro, setStateMetodosPago } =
    useCartVentasStore();
  const { dataempresa } = useEmpresaStore();
  return (
    <Container>
      <section className="imagen">
        <img src="https://i.ibb.co/tw1xqhHx/Cobrar-Roshi.png" alt="" />
      </section>
      <section className="contentTotal">
        <section className="contentTtuloTotal">
          <Btn1
            funcion={setStateMetodosPago}
            border="2px"
            bgcolor="#3ff563"
            color="#207c33"
            icono={<Icon icon="emojione:money-bag" width="20" height="20" />}
            titulo="Cobrar"
          ></Btn1>
          {/* <Btn1 border="2px" bgcolor="#fff" titulo="..."></Btn1> */}
        </section>
        <span>
          {" "}
          {FormatearNumeroDinero(
            total,
            dataempresa?.currency,
            dataempresa?.iso,
          )}{" "}
        </span>
      </section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  text-align: center;
  justify-content: space-between;
  border-radius: 15px;
  font-weight: 700;
  font-size: 40px;
  background-color: #3ff563;
  padding: 10px;
  color: #207c33;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) => theme.bgtotal};
    position: absolute;
    border-radius: 50%;
    top: 5px;
    right: 5px;
  }
  .imagen {
    width: 55px;
    position: relative;
    @media ${Device.desktop} {
      bottom: initial;
    }
    img {
      width: 100%;
    }
  }
  .contentTotal {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    font-size: 35px;
    position: relative; /* Añade esto */
    z-index: 10; /* Añade esto para que esté por encima de la imagen */

    .contentTtuloTotal {
      margin-top: 30px;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative; /* Asegura que el cursor responda aquí */
      z-index: 11; /* Refuerza la posición */

      @media ${Device.desktop} {
        display: none;
      }
    }
  }
`;
