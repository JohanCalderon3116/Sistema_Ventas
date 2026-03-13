import styled from "styled-components";
import {
  Btn1,
  Buscador,
  RegistrarCategorias,
  TablaCategorias,
  Title,
  useCategroriasStore,
} from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
export const CategoriasTemplate = () => {
  const { datacategorias } = useCategroriasStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect([]);
  }
  return (
    <Container>
      {openRegistro && (
        <RegistrarCategorias
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></RegistrarCategorias>
      )}
      <section className="area1">
        <Title>Categorias</Title>{" "}
        <Btn1
          funcion={nuevoRegistro}
          bgcolor={v.colorPrincipal}
          titulo="Nuevo"
          icono={<v.iconoagregar />}
        ></Btn1>
      </section>
      <section className="area2">
        <Buscador></Buscador>
      </section>
      <section className="main">
        {" "}
        <TablaCategorias data={datacategorias}></TablaCategorias>{" "}
      </section>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 30px);
  padding: 15px;
  overflow: hidden;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  .area1 {
    grid-area: area1;
    background-color: rgba(103, 93, 241, 0.14);
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .area2 {
    grid-area: area2;
    background-color: rgba(43, 172, 11, 0.14);
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .main {
    grid-area: main;
    background-color: rgba(237, 7, 221, 0.14);
  }
`;
