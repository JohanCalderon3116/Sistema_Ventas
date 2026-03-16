import styled from "styled-components";
import {Device} from "../../../styles/breakpoints"
import { Btn1 } from "../../../index";
export const FooterPos = () => {
  return (
    <Footer>
      <article className="content">
    <Btn1 titulo="Eliminar"></Btn1>
    <Btn1 titulo="Ver ventas del día y devoluciones"></Btn1>
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
  .content{
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;