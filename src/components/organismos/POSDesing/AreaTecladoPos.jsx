import styled from "styled-components";
import {
  Btn1,
  TotalPos,
  useDetalleVentasStore,
  useEmpresaStore,
  useMetodosPagoStore,
  useVentasStore,
} from "../../../index";
import { Device } from "../../../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";
import { useValidarPermisosOpertivos } from "../../../hooks/UseValidarPermisosOpertivos";
export const AreaTecladoPos = () => {
  const { setStatePantallaCobro, stateMetodosPago } = useVentasStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { validarPermiso } = useValidarPermisosOpertivos();
  const { detalleventa } = useDetalleVentasStore();
  const validarPermisosCobrar = (p) => {
    const response = validarPermiso("Cobrar venta");
    if (!response) return;
    console.log("tipocobro: ", p.nombre);
    setStatePantallaCobro({ data: detalleventa, tipocobro: p.nombre });
  };
  // const { data: dataMetodosPago } = useQuery({
  //   queryKey: ["mostrar metodos de pago"],
  //   queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
  //   enabled: !!dataempresa,
  // });
  return (
    <Container stateMetodosPago={stateMetodosPago}>
      <section className="areatipopago">
        {dataMetodosPago?.map((item, index) => {
          return (
            <article className="box" key={index}>
              <Btn1
                imagen={item.icono != "-" ? item.icono : null}
                funcion={() => validarPermisosCobrar(item)}
                border="0"
                height="70px"
                width="100%"
                titulo={item.nombre}
              ></Btn1>
            </article>
          );
        })}
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
  position: absolute;
  bottom: 10px;
  width: calc(100% - 5px);
  border-radius: 15px;
  max-height: 90vh; 
  overflow: hidden; 
  @media ${Device.desktop} {
    position: relative;
    width: 450px;
    bottom: initial;
    max-height: none;
  }
  .areatipopago {
    display: ${({ stateMetodosPago }) => (stateMetodosPago ? "flex" : "none")};
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    max-height: 45vh; 
    overflow-y: auto;
    @media ${Device.desktop} {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
      max-height: 300px; 
      overflow-y: auto;
    }
    .box {
      flex: 1 1 40%;
      display: flex;
      gap: 10px;
    }
  }
  .totales {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    flex-shrink: 0;
    .subtotal {
      display: none;
      flex-direction: column;
      justify-content: end;
      text-align: end;
      gap: 10px;
      font-weight: 500;
      @media ${Device.desktop} {
        display: flex;
      }
    }
  }
`;
