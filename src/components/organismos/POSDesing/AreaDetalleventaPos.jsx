import styled from "styled-components";
import { blur_in } from "../../../styles/Keyframes";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import {
  Btn1,
  InputText2,
  Lottieanimation,
  useEmpresaStore,
} from "../../../index";
import animaciovacio from "../../../assets/vacioanimation.json.json";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  useEditarCantidadDetalleVentaMutationStack,
  useEliminarCantidadDetalleVentaMutationStack,
  useMostrarDetalleVentaQueryStack,
} from "../../../tanstack/DetallesVentaStack";

export const AreaDetalleventaPos = () => {
  const { dataempresa } = useEmpresaStore();
  const [editIndex, setEditIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState(1);
  const { mutate: mutateEditarCantidadDetalleVenta } =
    useEditarCantidadDetalleVentaMutationStack();
  const { mutate: mutateEliminarDV } =
    useEliminarCantidadDetalleVentaMutationStack();
  const handleEditClick = (index, cantidad) => {
    setEditIndex(index);
    setNewCantidad(cantidad);
  };
  const handleInputChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value) || 0);
    setNewCantidad(value);
  };
  const handleInputBlur = (item) => {
    mutateEditarCantidadDetalleVenta({
      id: item.id,
      cantidad: newCantidad,
    });
    setEditIndex(null);
  };
  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputBlur(item);
    }
  };
  const { data: items } = useMostrarDetalleVentaQueryStack();

  return (
    <AreaDetalleventa className={items?.length > 0 ? "" : "animacion"}>
      {items?.length > 0 ? (
        items.map((item, index) => {
          return (
            <Itemventa key={index}>
              <article className="contentdescripcion">
                <span className="descripcion">{item.descripcion}</span>
                <span className="importe">
                  <strong>Precio unit:</strong>
                  <span className="precio-icon">•</span>
                  {FormatearNumeroDinero(
                    item.precio_venta,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
                <ContentTotalResponsive>
                  <span className="importerespo">
                    <strong>Precio unit:</strong>
                    <span className="precio-icon">•</span>
                    {FormatearNumeroDinero(
                      item.precio_venta,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}
                  </span>
                  <article className="contentTotaldetalleventarespon">
                    <span className="cantidad">
                      <strong>
                        {FormatearNumeroDinero(
                          item.total,
                          dataempresa?.currency,
                          dataempresa?.iso,
                        )}
                      </strong>
                    </span>
                    <span
                      className="delete"
                      onClick={() => mutateEliminarDV(item)}
                    >
                      <Icon icon="lucide:trash-2" width="18" height="18" />
                    </span>
                  </article>
                </ContentTotalResponsive>
              </article>
              <article className="contentbtn">
                <Btn1
                  funcion={() =>
                    mutateEditarCantidadDetalleVenta({
                      id: item.id,
                      cantidad: item.cantidad - 1,
                    })
                  }
                  width="36px"
                  height="36px"
                  icono={<Icon icon="lucide:minus" />}
                />
                {editIndex === index ? (
                  <InputText2>
                    <input
                      type="number"
                      value={newCantidad}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur(item)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      className="form__field"
                      min="1"
                    />
                  </InputText2>
                ) : (
                  <>
                    <span className="cantidad">{item.cantidad}</span>
                    <Icon
                      icon="lucide:pencil"
                      onClick={() => handleEditClick(index, item.cantidad)}
                      className="edit-icon"
                    />
                  </>
                )}
                <Btn1
                  funcion={() =>
                    mutateEditarCantidadDetalleVenta({
                      id: item.id,
                      cantidad: item.cantidad + 1,
                    })
                  }
                  width="36px"
                  height="36px"
                  icono={<Icon icon="lucide:plus" />}
                />
              </article>
              <article className="contentTotaldetalleventa">
                <span className="cantidad">
                  <strong>
                    {FormatearNumeroDinero(
                      item.total,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}
                  </strong>
                </span>
                <span className="delete" onClick={() => mutateEliminarDV(item)}>
                  <Icon icon="lucide:trash-2" width="18" height="18" />
                </span>
              </article>
            </Itemventa>
          );
        })
      ) : (
        <EmptyCartState>
          <div className="lottie-monochrome">
            <Lottieanimation animacion={animaciovacio} alto="180" ancho="180" />
          </div>
          <span className="empty-title">Sin productos en la venta actual</span>
          <span className="empty-sub">Escanea un código de barras o busca un producto para comenzar</span>
        </EmptyCartState>
      )}
    </AreaDetalleventa>
  );
};

const EmptyCartState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 24px;
  user-select: none;

  .lottie-monochrome {
    filter: grayscale(1) opacity(0.65);
    transition: opacity 0.25s ease;
  }

  .empty-title {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    opacity: 0.85;
  }

  .empty-sub {
    font-size: 13px;
    color: ${({ theme }) => theme.colorSubtitle};
    max-width: 320px;
  }
`;

const ContentTotalResponsive = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  .descripcionrespon {
    font-weight: 700;
    font-size: 20px;
  }
  .importerespo {
    font-size: 15px;
    display: flex;
    align-items: center;
    width: 100%;
    color: ${({ theme }) => theme.text};
    opacity: 0.78;
  }
  .precio-icon {
    margin: 0 5px;
    color: ${({ theme }) => theme.colorSubtitle};
    font-size: 11px;
    opacity: 0.8;
  }
  @media ${Device.laptop} {
    display: none;
  }
  .contentTotaldetalleventarespon {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    text-align: end;
    align-items: center;
    gap: 8px;
    width: 100%;
    .delete {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      transition: all 0.2s ease-out;
      &:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.05);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
`;

const AreaDetalleventa = styled.section`
  display: flex;
  width: 100%;
  margin-top: 10px;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 500px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 3px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colorScroll};
    border-radius: 10px;
  }
  &.animacion {
    height: 100%;
    justify-content: center;
  }
  @media ${Device.laptop} {
    max-height: initial;
    height: 100%;
    min-height: 0;
  }
`;

const Itemventa = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px dashed ${({ theme }) => theme.color2};
  animation: ${blur_in} 0.2s linear both;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
  .contentdescripcion {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    .descripcion {
      font-weight: 700;
      font-size: 18px;
      color: ${({ theme }) => theme.text};
    }
    .importe {
      font-size: 14px;
      display: none;
      align-items: center;
      color: ${({ theme }) => theme.colorSubtitle};
      .precio-icon {
        margin: 0 5px;
        color: ${({ theme }) => theme.colorSubtitle};
        font-size: 11px;
      }
      strong {
        font-weight: 600;
      }
      @media ${Device.laptop} {
        display: flex;
      }
    }
  }
  .contentbtn {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 10px;
    align-items: center;
    justify-content: center;
    .cantidad {
      font-size: 1.4rem;
      font-weight: 700;
      color: ${({ theme }) => theme.text};
    }
    .edit-icon {
      cursor: pointer;
      font-size: 16px;
      color: #10b981;
      transition: all 0.2s ease-out;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .contentTotaldetalleventa {
    display: none;
    @media ${Device.laptop} {
      display: flex;
      flex-direction: row;
      justify-content: center;
      text-align: end;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      width: 100%;
      .delete {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        transition: all 0.2s ease-out;
        &:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }
      }
    }
  }
  @media ${Device.tablet} {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
`;
