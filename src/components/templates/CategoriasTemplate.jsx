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
import Confetti from "react-confetti-boom";
import { Toaster } from "sonner";
export const CategoriasTemplate = () => {
  const { datacategorias, setBuscador } = useCategroriasStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect([]);
    setIsExploding(false);
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {openRegistro && (
        <RegistrarCategorias
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></RegistrarCategorias>
      )}
      <section className="area1">
        <Title>Categorías</Title>{" "}
        <Btn1
          funcion={nuevoRegistro}
          bgcolor="#3300E3"
          titulo="Nuevo"
          icono={<v.iconoagregar />}
        ></Btn1>
      </section>
      <section className="area2">
        <Buscador setBuscador={setBuscador}></Buscador>
      </section>
      <section className="main">
        {isExploding && <Confetti></Confetti>}
        <TablaCategorias
          data={datacategorias}
          SetopenRegistro={setOpenRegistro}
          setAccion={setAccion}
          setdataSelect={setDataSelect}
        ></TablaCategorias>{" "}
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
