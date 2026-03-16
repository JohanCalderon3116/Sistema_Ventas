import styled from "styled-components";
import { Btn1, TotalPos } from "../../../index";
import { Device } from "../../../styles/breakpoints";
export const AreaTecladoPos = () => {
  return (
    <Container>
      <section className="areatipopago">
        <article className="box">
          <Btn1 border="0" height="70px" width="100%" titulo="Efectivo" bgcolor="#a6f868"></Btn1>
          <Btn1 border="0" width="100%" titulo="Crédito" bgcolor="#fb81c6"></Btn1>
        </article>
        <article className="box">
          <Btn1 border="0" width="100%" height="70px" titulo="Tarjeta"bgcolor="#fba256"></Btn1>
          <Btn1 border="0" width="100%" titulo="Mixto" bgcolor="#919afd"></Btn1>
        </article>
      </section>
      <section className="totales">
        <div className="subtotal">
          <span>
            Sub total: <strong> $9.99</strong>{" "}
          </span>{" "}
          <span>IGV (18%): $ 0.00</span>{" "}
          <span>
            Sub total: <strong>$ 9.99</strong>{" "}
          </span>
        </div>
        <TotalPos></TotalPos>
      </section>
    </Container>
  );
};

const Container = styled.div`
  border: 2px solid ${({ theme }) => theme.color2};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 5px);
  border-radius: 15px;
  @media ${Device.desktop} {
    position: relative;
    width: auto;
    bottom: initial;
  }
  .areatipopago {
    display: none;
    @media ${Device.desktop} {
      display: initial;
    }
    .box {
      display: flex;
      gap: 20px;
      margin: 10px;
    }
  }
  .totales {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    .subtotal {
      display: none;
      flex-direction: column;
      justify-content: end;
      align-items: end;
      gap: 10px;
      font-weight: 500;
      @media ${Device.desktop} {
        display: flex;
      }
    }
  }
`;
