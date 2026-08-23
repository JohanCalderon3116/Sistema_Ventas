import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { IngresoCobro } from "./IngresoCobro";
import { useVentasStore } from "../../../store/VentasStore";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";

export const PantallaCobro = () => {
  const { setStatePantallaCobro, tipocobro } = useVentasStore();
  const ingresoCobroRef = useRef();
  const { detalleventa } = useDetalleVentasStore();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); //Aca evitamos el comportamiento predeterminado de presionar Enter (mas que nada para cerrar la vista)
        if (ingresoCobroRef.current) {
          ingresoCobroRef.current.mutateAsync();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown); //Añade el event listener al documento
    return () => {     //Limoia el event listener al desmontar el componente
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <Container>
      <section className="contentingresocobro">
        <IngresoCobro ref={ingresoCobroRef}></IngresoCobro>
        <article
          className="contentverticket"
          onClick={() =>
            setStatePantallaCobro({ data: detalleventa, tipocobro: tipocobro })
          }
        >
          <Icon icon="line-md:arrow-left" width="24" height="24" />
          <span>Volver</span>
        </article>
      </section>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
  background-color: ${({ theme }) => theme.bgtotal};
  .contentingresocobro {
    display: flex;
    justify-content: flex-start; 
    flex-direction: column;
    align-items: center;
    gap: 20px;
    height: calc(100% - 10rem);
    overflow-y: auto; 
    padding: 10px 0; 
    .contentverticket {
      align-self: flex-end;
      cursor: pointer;
      display: flex;
      gap: 10px;
      align-items: center;
      flex-shrink: 0; 
      span {
        font-weight: 700;
        font-size: 18px;
      }
      .icon {
        font-size: 30px;
      }
    }
  }
`;
