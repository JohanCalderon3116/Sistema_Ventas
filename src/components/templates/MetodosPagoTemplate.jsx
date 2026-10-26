import styled, { keyframes } from "styled-components";
import {
  Btn1,
  RegistrarMetodosPago,
  Title,
  useMetodosPagoStore,
} from "../../index";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { Toaster } from "sonner";
import { TablaMetodosPago } from "../organismos/tablas/TablaMetodosPago";
import { Icon } from "@iconify/react";

const aparecer = keyframes`
  from { opacity: 0; margin-top: 8px; }
  to { opacity: 1; margin-top: 0; }
`;

export const MetodosPagoTemplate = () => {
  const { dataMetodosPago } = useMetodosPagoStore();
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
      <Toaster richColors position="top-center"></Toaster>
      {openRegistro && (
        <RegistrarMetodosPago
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></RegistrarMetodosPago>
      )}
      <section className="area1">
        <Title>Métodos de pago</Title>{" "}
        <Btn1
          funcion={nuevoRegistro}
          bgcolor="#18181B"
          color="255,255,255"
          titulo="Nuevo"
          border="1px"
          icono={<Icon icon="lucide:plus" />}
        />
      </section>
      <section className="main">
        {isExploding && <Confetti></Confetti>}
        <TablaMetodosPago
          data={dataMetodosPago}
          SetopenRegistro={setOpenRegistro}
          setAccion={setAccion}
          setdataSelect={setDataSelect}
        ></TablaMetodosPago>{" "}
      </section>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: calc(100vh - 30px);
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  overflow: auto;
  animation: ${aparecer} 0.3s ease both;
  .area1 {
    grid-area: area1;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .main {
    grid-area: main;
    position: relative;
    z-index: 2;
  }
`;
