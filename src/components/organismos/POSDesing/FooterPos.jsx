import styled from "styled-components";
import { Device } from "../../../styles/breakpoints";
import {
  Btn1,
  useCierreCajaStore,
  useEliminarVentasMutationStack,
  useMovimientosCreditosStore,
} from "../../../index";
import { Icon } from "@iconify/react";
export const FooterPos = () => {
  const { setStateIngresoSalida, setTipoRegistro, setStateCierreCaja } =
    useCierreCajaStore();
  const { setStateIngresoCredito } = useMovimientosCreditosStore();
  const { mutate: mutateEliminarVenta, isPending } =
    useEliminarVentasMutationStack();
  return (
    <Footer>
      <article className="content">
        <Btn1
          bgcolor="#f44141"
          color="#fff"
          funcion={mutateEliminarVenta}
          disabled={isPending}
          titulo="Eliminar venta"
          icono={
            <Icon
              icon="streamline-ultimate-color:skull"
              width="24"
              height="24"
            />
          }
        ></Btn1>
        <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          funcion={() => setStateCierreCaja(true)}
          icono={<Icon icon="emojione:card-file-box" />}
          titulo="Cerrar caja"
        />
        <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          funcion={() => {
            setStateIngresoSalida(true);
            setTipoRegistro("ingreso");
          }}
          icono={<Icon icon="fluent-emoji:dollar-banknote" />}
          titulo="Ingresar dinero"
        />
        <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          funcion={() => {
            setStateIngresoSalida(true);
            setTipoRegistro("salida");
          }}
          icono={<Icon icon="noto-v1:money-bag" />}
          titulo="Retirar dinero"
        />
        <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          funcion={() => {
            setStateIngresoCredito(true);
            setTipoRegistro("ingreso");
          }}
          icono={<Icon icon="fluent-emoji:credit-card" />}
          titulo="Abonar Crédito"
        />
        {/* <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          icono={<Icon icon="icon-park:preview-open" />}
          titulo="Ver ventas del día"
        /> */}
      </article>
    </Footer>
  );
};

const Footer = styled.section`
  grid-area: footer;
  display: none;

  @media ${Device.desktop} {
    display: flex;
  }
  .content {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;
