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
import { v } from "../../styles/variables";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { RegistrarCreditos } from "../organismos/formularios/RegistrarCreditos";
import { Toaster } from "sonner";
import { TablaCreditos } from "../organismos/tablas/TablaCreditos";
import { useCreditosStore } from "../../store/CreditosStore";
import { useMostrarContraseñaQueryStack } from "../../tanstack/LoginStack";
import { BeatLoader } from "react-spinners";
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
      <Toaster richColors></Toaster>
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
          bgcolor="#6d05e5"
          titulo="Nuevo"
          icono={<v.iconoagregar />}
        ></Btn1>
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
const ModalContraseña = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  .card {
    background: ${({ theme }) => theme.body2};
    padding: 30px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
    border: 1px solid #7c7c7c;
    span {
      font-weight: 700;
      font-size: 1.1rem;
      text-align: center;
    }
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
