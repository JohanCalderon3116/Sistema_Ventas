import styled from "styled-components";
import {
  Btn1,
  Buscador,
  RegistrarProductos,
  TablaProductos,
  Title,
  useProductosStore,
} from "../../index";
import { v } from "../../styles/variables";
import { useEffect, useState } from "react";
import Confetti from "react-confetti-boom";
export const ProductosTemplate = () => {
  const { dataProductos, setBuscador, generarCodigo } = useProductosStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
    setIsExploding(false);
    generarCodigo();
    console.log(dataSelect)
  }
  return (
    <Container>
      <RegistrarProductos
        setIsExploding={setIsExploding}
        onClose={() => setOpenRegistro(!openRegistro)}
        dataSelect={dataSelect}
        accion={accion}
        state={openRegistro}
      ></RegistrarProductos>

      <section className="area1">
        <Title>Productos</Title>{" "}
        <Btn1
          funcion={nuevoRegistro}
          bgcolor={v.colorPrincipal}
          titulo="Nuevo"
          icono={<v.iconoagregar />}
        ></Btn1>
      </section>
      <section className="area2">
        <Buscador setBuscador={setBuscador}></Buscador>
      </section>
      <section className="main">
        {isExploding && <Confetti></Confetti>}
        <TablaProductos
          data={dataProductos}
          SetopenRegistro={setOpenRegistro}
          setAccion={setAccion}
          setdataSelect={setdataSelect}
        ></TablaProductos>{" "}
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
