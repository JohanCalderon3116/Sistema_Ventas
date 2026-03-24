import styled from "styled-components";
import { blur_in } from "../../../styles/Keyframes";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import {
  Btn1,
  InputText2,
  Lottieanimation,
  useCartVentasStore,
  useEmpresaStore,
} from "../../../index";
import animaciovacio from "../../../assets/vacioanimation.json.json";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import { useState } from "react";
export const AreaDetalleventaPos = () => {
  const {
    items,
    addCantidadItem,
    restarCantidadItem,
    removeItem,
    updateCantidadItem,
  } = useCartVentasStore();
  const { dataempresa } = useEmpresaStore();
  const [editIndex, setEditIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState(1);
  const handleEditClick = (index, cantidad) => {
    setEditIndex(index);
    setNewCantidad(cantidad);
  };
  const handleInputChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setNewCantidad(value);
  };
  const handleInputBlur = (item) => {
    updateCantidadItem(item, newCantidad);
    setEditIndex(null);
  };
  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      handleInputBlur(item);
    }
  };
  return (
    <AreaDetalleventa className={items.length > 0 ? "" : "animacion"}>
      {items.length > 0 ? (
        items.map((item, index) => {
          return (
            <Itemventa key={index}>
              <article className="contentdescripcion">
                <span className="descripcion"> {item._descripcion} </span>
                <span className="importe">
                  <strong>Precio venta: </strong>
                  {FormatearNumeroDinero(
                    item._precio_venta,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}{" "}
                </span>
              </article>
              <article className="contentbtn">
                <Btn1
                  funcion={() => restarCantidadItem(item)}
                  width="20px"
                  icono={<Icon icon="line-md:minus" width="20" height="20" />}
                ></Btn1>
                {editIndex === index ? (
                  <InputText2>
                    {" "}
                    <input
                      type="number"
                      value={newCantidad}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur(item)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      className="form__field"
                      min="1"
                    ></input>{" "}
                  </InputText2>
                ) : (
                  <>
                    <span className="cantidad">
                      {" "}
                      <strong>{item._cantidad} </strong>
                    </span>
                    <Icon
                      onClick={() => handleEditClick(index, item._cantidad)}
                      icon="line-md:pencil"
                      width="24"
                      height="24"
                      className="edit-icon"
                    />
                  </>
                )}

                <Btn1
                  bgcolor="#0aca21"
                  color="#fff"
                  funcion={() => addCantidadItem(item)}
                  width="20px"
                  icono={
                    <Icon icon="material-symbols:add" width="20" height="20" />
                  }
                ></Btn1>
              </article>
              <article className="contenttotaldetalleventa">
                <span className="cantidad">
                  <strong>
                    {FormatearNumeroDinero(
                      item._total,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}
                  </strong>
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
  flex-direction: column;
  gap: 10px;
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
      font-size: 15px;
    }
  }
  .contentbtn {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    .cantidad {
      font-size: 1.8rem;
      font-weight: 700;
    }
    .edit-icon {
      cursor: pointer;
      font-size: 18px;
    }
  }
  .contenttotaldetalleventa {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: end;
    margin-bottom: 10px;
    .delete {
      cursor: pointer;
      width: 20px;
      align-self: flex-end;
    }
  }
  @media ${Device.tablet} {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px dashed ${({ theme }) => theme.color2};
    animation: ${blur_in} 0.4s linear both;
    flex-direction: row;
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
        font-size: 15px;
      }
    }
    .contentbtn {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      .cantidad {
        font-size: 1.8rem;
        font-weight: 700;
      }
      .edit-icon {
        cursor: pointer;
        font-size: 18px;
      }
    }
    .contenttotaldetalleventa {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      text-align: end;
      margin-bottom: 10px;
      .delete {
        cursor: pointer;
        width: 20px;
        align-self: flex-end;
      }
    }
  }
`;
