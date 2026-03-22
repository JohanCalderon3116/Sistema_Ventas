import styled from "styled-components";
import { Device } from "../../../styles/breakpoints";
import { Btn1, useCartVentasStore } from "../../../index";
import { Icon } from "@iconify/react";
export const FooterPos = () => {
  const { resetState } = useCartVentasStore();
  return (
    <Footer>
      <article className="content">
        <Btn1
          bgcolor="#f44141"
          color="#fff"
          funcion={resetState}
          titulo="Eliminar venta"
          icono={
            <Icon
              icon="streamline-ultimate-color:skull"
              width="24"
              height="24"
            />
          }
        ></Btn1>
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
