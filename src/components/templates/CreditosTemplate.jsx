import styled from "styled-components";
import {
  Btn1,
  Buscador,
  InputText2,
  RegistrarAbonoCreditos,
  Spinner1,
  TablaClientesProveedores,
  Title,
  useClientesProveedoresStore,
  useEmpresaStore,
} from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { useLocation } from "react-router-dom";
import { RegistrarCreditos } from "../organismos/formularios/RegistrarCreditos";
import { toast, Toaster } from "sonner";
import { TablaCreditos } from "../organismos/tablas/TablaCreditos";
import { useQuery } from "@tanstack/react-query";
import { useCreditosStore } from "../../store/CreditosStore";
import { useContraseñaStore } from "../../store/ContraseñaStore";
export const CreditosTemplate = () => {
  const { setBuscador, buscador, buscarCreditos } = useCreditosStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [openRegistroAgregar, setOpenRegistroAgregar] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [dataSelectAgregar, setDataSelectAgregar] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const [isExplodingAgregar, setIsExplodingAgregar] = useState(false);
  const [contraseñaOk, setContraseñaOk] = useState(false);
  const [openModalContraseña, setOpenModalContraseña] = useState(false);
  const [inputContraseña, setInputContraseña] = useState("");
  const { mostrarCreditos, datacreditos } = useCreditosStore();
  const { mostrarContraseña, dataContraseña } = useContraseñaStore();
  const { dataempresa } = useEmpresaStore();
  const location = useLocation();
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setDataSelect([]);
    setIsExploding(false);
  }
  function nuevoRegistroAgregar() {
    setOpenRegistroAgregar(!openRegistroAgregar);
    setDataSelectAgregar([]);
    setIsExplodingAgregar(false);
  }
  useQuery({
    queryKey: ["mostrar contraseña"],
    queryFn: mostrarContraseña,
  });

  const validarContraseña = () => {
    const contraseñaReal = dataContraseña[0]?.contraseña;

    if (Number(inputContraseña) === contraseñaReal) {
      setOpenModalContraseña(false);
      setInputContraseña("");
      setOpenRegistro(true);
      toast.success(
        "Contraseña de verificaion correcta, entrando al moduo Créditos",
      );
    } else {
      toast.error("Contraseña incorrecta");
    }
  };
  const { isLoading } = useQuery({
    queryKey: ["mostrar creditos", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarCreditos({
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa?.id,
  });
  useQuery({
    queryKey: ["buscar creditos", buscador],
    queryFn: () =>
      buscarCreditos({ id_empresa: dataempresa?.id, nombres: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
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
          dataSelect={dataSelect}
        ></RegistrarCreditos>
      )}
      {openRegistroAgregar && (
        <RegistrarAbonoCreditos
          setIsExploding={setIsExplodingAgregar}
          onClose={() => setOpenRegistroAgregar(!openRegistroAgregar)}
          dataSelect={dataSelectAgregar}
        ></RegistrarAbonoCreditos>
      )}
      <section className="area1">
        <Title>Créditos</Title>
        <Btn1
          funcion={() => setOpenModalContraseña(true)}
          bgcolor={v.colorPrincipal}
          titulo="Nuevo"
          icono={<v.iconoagregar />}
        ></Btn1>

        <Btn1
          funcion={nuevoRegistroAgregar}
          bgcolor={v.colorPrincipal}
          titulo="Abonos"
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
    background: ${({ theme }) => theme.bg};
    padding: 30px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
    span {
      font-weight: 700;
      font-size: 1.1rem;
      text-align: center;
    }
  }
`;
