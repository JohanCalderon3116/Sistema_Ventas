import styled from "styled-components";
import { Btn1, Buscador, Title, useGlobalStore } from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { BuscadorList } from "../ui/lists/Buscador";
import { Toaster } from "sonner";
export const SerealizacionesTemplate = ({
  Formularioregistro,
  title,
  Table,
  data,
  setBuscador,
  tipoBuscador,
  dataBuscadorList,
  selectBuscadorList,
  setBuscadorList,
  stateBtnAdd,
  stateBuscador,
}) => {
  const {
    stateClose,
    isExploding,
    setItemSelect,
    setAccion,
    setIsExplonding,
    setStateClose,
  } = useGlobalStore();

  function nuevoRegistro() {
    setStateClose(true);
    setAccion("Nuevo");
    setItemSelect([]);
    setIsExplonding(false);
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {stateClose && Formularioregistro && (
        <Formularioregistro
        ></Formularioregistro>
      )}
      <section className="area1">
        <Title> {title} </Title>{" "}
        {stateBtnAdd && (
          <Btn1
            funcion={nuevoRegistro}
            bgcolor={v.colorPrincipal}
            titulo="Nuevo"
            icono={<v.iconoagregar />}
          ></Btn1>
        )}
      </section>
      {stateBuscador && (
        <section className="area2">
          {tipoBuscador === "list" ? (
            <BuscadorList
              data={dataBuscadorList}
              onSelect={selectBuscadorList}
              setBuscador={setBuscadorList}
            ></BuscadorList>
          ) : (
            <Buscador setBuscador={setBuscador}></Buscador>
          )}
        </section>
      )}

      <section className="main">
        {isExploding && <Confetti></Confetti>}
        {data.length && Table}
      </section>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 30px);
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  .area1 {
    grid-area: area1;

    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .area2 {
    grid-area: area2;

    display: flex;
    justify-content: end;
    align-items: center;
  }
  .main {
    grid-area: main;
  }
`;
