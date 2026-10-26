import styled from "styled-components";
import {
  Btn1,
  Buscador,
  RegistrarUsuarios,
  TablaUsuarios,
  Title,
  useAsignacionCajaSucursalesStore,
} from "../../index";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { Toaster } from "sonner";
import { Icon } from "@iconify/react";

export const UsuariosTemplate = () => {
  const [openRegistro, setOpenRegistro] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const {
    accion,
    setAccion,
    dataUsuariosAsignados,
    setBuscador,
    setSelectItem,
  } = useAsignacionCajaSucursalesStore();
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect([]);
    setIsExploding(false);
    setSelectItem(null);
  }
  return (
    <Container>
      <Toaster richColors position="top-center"></Toaster>
      {openRegistro && (
        <RegistrarUsuarios
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></RegistrarUsuarios>
      )}
      <section className="area1">
        <Title>Usuarios</Title>{" "}
        <Btn1
          funcion={nuevoRegistro}
          bgcolor="#18181B"
          color="255,255,255"
          titulo="Nuevo"
          border="1px"
          icono={<Icon icon="lucide:plus" />}
        />
      </section>
      <section className="area2">
        <Buscador setBuscador={setBuscador}></Buscador>
      </section>
      <section className="main">
        {isExploding && <Confetti></Confetti>}
        <TablaUsuarios
          data={dataUsuariosAsignados}
          SetopenRegistro={setOpenRegistro}
          setAccion={setAccion}
          setdataSelect={setDataSelect}
        ></TablaUsuarios>{" "}
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
