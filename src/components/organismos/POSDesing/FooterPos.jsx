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
          bgcolor="#EF4444"
          color="#FFFFFF"
          funcion={mutateEliminarVenta}
          disabled={isPending}
          titulo="Eliminar venta"
          icono={<Icon icon="lucide:trash-2" width="18" height="18" />}
        />
        <Btn1
          funcion={() => setStateCierreCaja(true)}
          icono={<Icon icon="lucide:lock" width="18" height="18" />}
          titulo="Cerrar caja"
        />
        <Btn1
          bgcolor="#10B981"
          color="#FFFFFF"
          funcion={() => {
            setStateIngresoSalida(true);
            setTipoRegistro("ingreso");
          }}
          icono={<Icon icon="lucide:arrow-down-circle" width="18" height="18" />}
          titulo="Ingresar dinero"
        />
        <Btn1
          funcion={() => {
            setStateIngresoSalida(true);
            setTipoRegistro("salida");
          }}
          icono={<Icon icon="lucide:arrow-up-circle" width="18" height="18" />}
          titulo="Retirar dinero"
        />
        <Btn1
          funcion={() => {
            setStateIngresoCredito(true);
            setTipoRegistro("ingreso");
          }}
          icono={<Icon icon="lucide:credit-card" width="18" height="18" />}
          titulo="Abonar Crédito"
        />
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
    gap: 10px;
    align-items: center;
  }
`;
