import styled from "styled-components";
import {
  Btn1,
  Buscador,
  RegistrarClientesProveedores,
  TablaClientesProveedores,
  Title,
  useClientesProveedoresStore,
} from "../../index";
import { useState } from "react";
import Confetti from "react-confetti-boom";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Icon } from "@iconify/react";

export const ClientesProveedoresTemplate = () => {
  const { dataclipro, setBuscador, setTipo } = useClientesProveedoresStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const location = useLocation();
  const esCliente = location.pathname === "/configuracion/clientes";
  const titulo = esCliente ? "Clientes" : "Proveedores";

  function nuevoRegistro() {
    setTipo(esCliente ? "cliente" : "proveedor");
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect([]);
    setIsExploding(false);
  }

  return (
    <Container>
      <Toaster richColors position="top-center" />
      {openRegistro && (
        <RegistrarClientesProveedores
          setIsExploding={setIsExploding}
          onClose={() => setOpenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        />
      )}
      <section className="area1">
        <Title>{titulo}</Title>
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
        <Buscador setBuscador={setBuscador} />
      </section>
      <section className="main">
        {isExploding && <Confetti />}
        <TablaClientesProveedores
          data={dataclipro}
          SetopenRegistro={setOpenRegistro}
          setAccion={setAccion}
          setdataSelect={setDataSelect}
        />
      </section>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  z-index: 1;
  height: calc(100vh - 30px);
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  overflow: auto;
  .area1 {
    grid-area: area1;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
    position: relative;
    z-index: 2;
  }
  .area2 {
    grid-area: area2;
    display: flex;
    justify-content: end;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .main {
    grid-area: main;
    position: relative;
    z-index: 2;
    min-height: 0;
  }
  button {
    transition: all 0.2s ease-out;
  }
  button:hover {
    transform: translateY(-1px);
  }
  button:active {
    transform: scale(0.98);
  }
`;
