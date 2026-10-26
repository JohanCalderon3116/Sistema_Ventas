import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { IngresoCobro } from "./IngresoCobro";
import { useVentasStore } from "../../../store/VentasStore";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";

export const PantallaCobro = () => {
  const { setStatePantallaCobro, tipocobro } = useVentasStore();
  const ingresoCobroRef = useRef();
  const enviandoRef = useRef(false); // guard sincrónico anti doble disparo
  const { detalleventa } = useDetalleVentasStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();

      if (event.repeat) return; // ignora repeticiones por tecla sostenida
      if (enviandoRef.current) return; // ya se disparó, ignora hasta que termine

      if (ingresoCobroRef.current) {
        enviandoRef.current = true;
        ingresoCobroRef.current.mutateAsync().finally(() => {
          enviandoRef.current = false;
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
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
