import styled, { useTheme } from "styled-components";
import {
  Btn1,
  Buscador,
  HistorialCreditoModal,
  TicketModalCredito,
  Title,
  useBuscarCreditsoQueryStack,
  useMostrarCreditosQueryStack,
} from "../../index";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { RegistrarCreditos } from "../organismos/formularios/RegistrarCreditos";
import { Toaster } from "sonner";
import { TablaCreditos } from "../organismos/tablas/TablaCreditos";
import { useCreditosStore } from "../../store/CreditosStore";
import { useMostrarContraseñaQueryStack } from "../../tanstack/LoginStack";
import { BeatLoader } from "react-spinners";
import { Icon } from "@iconify/react";

export const CreditosTemplate = () => {
  const { setBuscador } = useCreditosStore();
  const theme = useTheme();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const [accion, setAccion] = useState(false);
  const { datacreditos } = useCreditosStore();
  useMostrarContraseñaQueryStack();
  const { isLoading } = useMostrarCreditosQueryStack();
  useBuscarCreditsoQueryStack();
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect([]);
    setIsExploding(false);
  }
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }
  return (
    <Container>
      <Toaster richColors position="top-center"></Toaster>
      {openRegistro && (
        <RegistrarCreditos
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></RegistrarCreditos>
      )}
      <HistorialCreditoModal></HistorialCreditoModal>
      <TicketModalCredito></TicketModalCredito>
      <section className="area1">
        <Title>Créditos</Title>
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
        <TablaCreditos
          data={datacreditos || []}
          SetopenRegistro={setOpenRegistro}
          setdataSelect={setDataSelect}
          setAccion={setAccion}
        ></TablaCreditos>{" "}
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

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
