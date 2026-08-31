import styled, { useTheme } from "styled-components";
import {
  Btn1,
  Buscador,
  InputText2,
  Title,
  useBuscarCreditsoQueryStack,
  useMostrarCreditosQueryStack,
} from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { RegistrarCreditos } from "../organismos/formularios/RegistrarCreditos";
import { toast, Toaster } from "sonner";
import { TablaCreditos } from "../organismos/tablas/TablaCreditos";
import { useCreditosStore } from "../../store/CreditosStore";
import { useContraseñaStore } from "../../store/ContraseñaStore";
import { useMostrarContraseñaQueryStack } from "../../tanstack/LoginStack";
import { BeatLoader } from "react-spinners";
export const CreditosTemplate = () => {
  const { setBuscador } = useCreditosStore();
  const theme = useTheme();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const [openModalContraseña, setOpenModalContraseña] = useState(false);
  const [inputContraseña, setInputContraseña] = useState("");
  const { datacreditos } = useCreditosStore();
  const { dataContraseña } = useContraseñaStore();
  useMostrarContraseñaQueryStack();
  const validarContraseña = () => {
    const contraseñaReal = dataContraseña[0]?.contraseña;
    if (Number(inputContraseña) === contraseñaReal) {
      setOpenModalContraseña(false);
      setInputContraseña("");
      setOpenRegistro(true);
      toast.success(
        "Contraseña de verificación correcta, entrando al módulo Créditos 🔓",
      );
    } else {
      toast.error(
        "La contraseña de verificación es incorrecta, inténtalo de nuevo 😧",
      );
    }
  };
  const { isLoading } = useMostrarCreditosQueryStack();
  useBuscarCreditsoQueryStack();
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
      {openModalContraseña && (
        <ModalContraseña>
          <div className="card">
            <span>Ingresa la contraseña</span>
            <InputText2>
              <input
                className="form__field"
                placeholder="Contraseña"
                type="password"
                value={inputContraseña}
                onChange={(e) => setInputContraseña(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && validarContraseña()}
              />
            </InputText2>
            <Btn1 titulo="Verificar" funcion={validarContraseña} width="100%" />
            <Btn1
              titulo="Cancelar"
              funcion={() => setOpenModalContraseña(false)}
              width="100%"
            />
          </div>
        </ModalContraseña>
      )}
      {openRegistro && (
        <RegistrarCreditos
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
        ></RegistrarCreditos>
      )}
      <section className="area1">
        <Title>Créditos</Title>
        <Btn1
          funcion={() => setOpenModalContraseña(true)}
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
