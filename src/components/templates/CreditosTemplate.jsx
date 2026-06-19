import styled from "styled-components";
import {
  Btn1,
  Buscador,
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
import { Toaster } from "sonner";
import { TablaCreditos } from "../organismos/tablas/TablaCreditos";
import { useQuery } from "@tanstack/react-query";
import { useCreditosStore } from "../../store/CreditosStore";
export const CreditosTemplate = () => {
  const { dataclipro, setBuscador } = useClientesProveedoresStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [openRegistroAgregar, setOpenRegistroAgregar] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [dataSelectAgregar, setDataSelectAgregar] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const [isExplodingAgregar, setIsExplodingAgregar] = useState(false);
  const { mostrarCreditos, datacreditos } = useCreditosStore();
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
  const { dataempresa } = useEmpresaStore();
  const { data, isLoading } = useQuery({
    queryKey: ["mostrar creditos", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarCreditos({
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa?.id,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
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
          funcion={nuevoRegistro}
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
          data={data || []}
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
