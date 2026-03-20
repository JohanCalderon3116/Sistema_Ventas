import styled from "styled-components";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import { useQuery } from "@tanstack/react-query";
import { useVentasStore } from "../../../store/VentasStore";
import { blur_in } from "../../../styles/Keyframes";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import { Btn1, Lottieanimation, useCartVentasStore } from "../../../index";
import animaciovacio from "../../../assets/vacioanimation.json.json";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
export const AreaDetalleventaPos = () => {
  const { mostrardetalleventI, detalleventa, eliminardetalleventa, total } =
    useDetalleVentasStore();
  const { items, addCantidadItem, restarCantidadItem, removeItem } =
    useCartVentasStore();
  const { idventa } = useVentasStore();
  useQuery({
    queryKey: ["mostrar detalle venta", { id_venta: idventa }],
    queryFn: async () => mostrardetalleventa({ id_venta: idventa }),
    enabled: idventa != undefined,
  });
  return (
    <AreaDetalleventa className={items.length > 0 ? "" : "animacion"}>
      {items.length > 0 ? (
        items.map((item, index) => {
          return (
            <Itemventa key={index}>
              <article className="contentdescripcion">
                <span className="descripcion">
                  {" "}
                  {item._cantidad} {item._descripcion}{" "}
                </span>
                <span className="importe">
                  Precio de venta:
                  {FormatearNumeroDinero(item._precio_venta)}{" "}
                </span>
              </article>
              <article className="contentbtn">
                <Btn1
                  funcion={() => restarCantidadItem(item)}
                  width="20px"
                  icono={<Icon icon="line-md:minus" width="20" height="20" />}
                ></Btn1>
                <Btn1
                  funcion={() => addCantidadItem(item)}
                  width="20px"
                  icono={
                    <Icon icon="material-symbols:add" width="20" height="20" />
                  }
                ></Btn1>
              </article>
              <article className="contentcantidad">
                <span className="cantidad">
                  <strong>{FormatearNumeroDinero(item._total)}</strong>
                </span>
                <span className="delete" onClick={() => removeItem(item)}>
                  💀
                </span>
              </article>
            </Itemventa>
          );
        })
      ) : (
        <Lottieanimation
          alto="200"
          ancho="200"
          animacion={animaciovacio}
        ></Lottieanimation>
      )}
    </AreaDetalleventa>
  );
};

const AreaDetalleventa = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  gap: 10px;
  &.animacion {
    @media ${Device.desktop} {
      height: 100%;
      justify-content: center;
    }
  }
`;
const Itemventa = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px dashed ${({ theme }) => theme.color2};
  animation: ${blur_in} 0.4s linear both;
  .contentdescripcion {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    .descripcion {
      font-weight: 700;
      font-size: 20px;
    }
    .importe {
      font-size: 12px;
    }
  }
  .contentbtn {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  .contentcantidad {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    text-align: end;
    margin-bottom: 10px;
    .delete {
      cursor: pointer;
      width: 20px;
      align-self: flex-end;
    }
  }
`;
