import styled from "styled-components";
import {
  Btn1,
  TotalPos,
  useCartVentasStore,
  useEmpresaStore,
  useMetodosPagoStore,
} from "../../../index";
import { Device } from "../../../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";
export const AreaTecladoPos = () => {
  const { setStatePantallaCobro } = useCartVentasStore();
  const { mostrarMetodosPago } = useMetodosPagoStore();
  const { dataempresa } = useEmpresaStore();
  const { data: dataMetodosPago } = useQuery({
    queryKey: ["mostrar metodos de pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
  return (
    <Container>
      <section className="areatipopago">
        {dataMetodosPago?.map((item, index) => {
          return (
            <article className="box" key={index}>
              <Btn1
                imagen={item.icono != "-" ? item.icono : null}
                funcion={() =>
                  setStatePantallaCobro({ tipocobro: item.nombre })
                }
                border="0"
                height="70px"
                width="100%"
                titulo={item.nombre}
              ></Btn1>
            </article>
          );
        })}
        {/* <article className="box">
          <Btn1
            funcion={() => setStatePantallaCobro({ tipocobro: "efectivo" })}
            border="0"
            height="70px"
            width="100%"
            titulo="Efectivo"
            bgcolor="#a6f868"
          ></Btn1>
          <Btn1
            funcion={() => setStatePantallaCobro({ tipocobro: "credito" })}
            border="0"
            width="100%"
            titulo="Crédito"
            bgcolor="#fb81c6"
          ></Btn1>
        </article> */}
        {/* <article className="box">
          <Btn1
            funcion={() => setStatePantallaCobro({ tipocobro: "tarjeta" })}
            border="0"
            width="100%"
            height="70px"
            titulo="Tarjeta"
            bgcolor="#fba256"
          ></Btn1>
          <Btn1
            funcion={() => setStatePantallaCobro({ tipocobro: "mixto" })}
            border="0"
            width="100%"
            titulo="Mixto"
            bgcolor="#919afd"
          ></Btn1>
        </article> */}
      </section>
      <section className="totales">
        {/* <div className="subtotal">
          <span>
            Sub total: <strong> $9.99</strong>{" "}
          </span>{" "}
          <span>
            IGV: <strong> $9.99</strong>{" "}
          </span>
          <span>
            Sub total: <strong>$ 9.99</strong>{" "}
          </span>
        </div> */}
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
  position: relative;
  margin-top: auto;
  width: calc(100% - 5px);
  max-height: 100%;
  border-radius: 15px;
  @media ${Device.desktop} {
    position: relative;
    width: auto;
    bottom: initial;
  }
  .areatipopago {
    // display: none;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    @media ${Device.desktop} {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
    }
    .box {
      flex: 1 1 40%;
      display: flex;
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
