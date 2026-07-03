import styled from "styled-components";
import {
  Btn1,
  Buscador,
  RegistrarClientesProveedores,
  TablaClientesProveedores,
  Title,
  useClientesProveedoresStore,
} from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
export const ClientesProveedoresTemplate = () => {
  const { dataclipro, setBuscador } = useClientesProveedoresStore();
  const { setTipo } = useClientesProveedoresStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const location = useLocation();
  function nuevoRegistro() {
    const tipo =
      location.pathname === "/configuracion/clientes" ? "cliente" : "proveedor";
    setTipo(tipo);
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect([]);
    setIsExploding(false);
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {openRegistro && (
        <RegistrarClientesProveedores
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        ></RegistrarClientesProveedores>
      )}
      <section className="area1">
        <Title>
          {" "}
          {location.pathname === "/configuracion/clientes"
            ? "Clientes"
            : "Proveedores"}{" "}
        </Title>{" "}
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
        <TablaClientesProveedores
          data={dataclipro}
          SetopenRegistro={setOpenRegistro}
          setAccion={setAccion}
          setdataSelect={setDataSelect}
        ></TablaClientesProveedores>{" "}
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
