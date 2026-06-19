import styled from "styled-components";
import { Btn1, Buscador, Title } from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { BuscadorList } from "../ui/lists/Buscador";
export const CrudTemplate = ({
  Formularioregistro,
  title,
  Table,
  data,
  setBuscador,
  tipoBuscador,
  dataBuscadorList,
  selectBuscadorList,
  setBuscadorList,
}) => {
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
      {openRegistro && Formularioregistro && (
        <Formularioregistro
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></Formularioregistro>
      )}
      <section className="area1">
        <Title> {title} </Title>{" "}
        <Btn1
          funcion={nuevoRegistro}
          bgcolor={v.colorPrincipal}
          titulo="Nuevo"
          icono={<v.iconoagregar />}
        ></Btn1>
      </section>
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
      <section className="main">
        {isExploding && <Confetti></Confetti>}
        {Table && (
          <Table
            data={data}
            SetopenRegistro={setOpenRegistro}
            setAccion={setAccion}
            setdataSelect={setDataSelect}
          ></Table>
        )}
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
