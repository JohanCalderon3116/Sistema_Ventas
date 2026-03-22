import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useCartVentasStore } from "../../../store/CartVentasStore";
import { IngresoCobro } from "./IngresoCobro";

export const PantallaCobro = () => {
  const [stateVerticket, setStateVerticket] = useState(false);
  const { setStatePantallaCobro } = useCartVentasStore();
  const ingresoCobroRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); //Aca evitamos el comportamiento predeterminado de presionar Enter (mas que nada para cerrar la vista)
        if (ingresoCobroRef.current) {
          ingresoCobroRef.current.mutateAsync();
        }
      }
    };
    //Añade el event listener al documento
    document.addEventListener("keydown", handleKeyDown);
    //Limoia el event listener al desmontar el componente
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <Container>
      <section className="contentingresocobro">
        <article
          className="contentverticket"
          onClick={() => setStateVerticket(!stateVerticket)}
        >
          <span> {stateVerticket ? "Ocultar" : "Mostrar"} ticket </span>
          {stateVerticket ? (
            <Icon icon="fluent-emoji:monkey-face" className="icon"></Icon>
          ) : (
            <Icon
              icon="fluent-emoji:see-no-evil-monkey"
              className="icon"
            ></Icon>
          )}
        </article>
        <IngresoCobro ref={ingresoCobroRef}></IngresoCobro>
        <article className="contentverticket" onClick={setStatePantallaCobro}>
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
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    height: calc(100% - 10rem);
    .contentverticket {
      align-self: flex-end;
      cursor: pointer;
      display: flex;
      gap: 10px;
      align-items: center;
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
