import styled from "styled-components";
import { useProductosStore } from "../../../store/ProductosStore";
import { useVentasStore } from "../../../store/VentasStore";
import { useStockStore } from "../../../store/StockStore";
import { Btn1 } from "../../moleculas/Btn1";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { Icon } from "@iconify/react";
import { InputText2 } from "../formularios/InputText2";
import { useInsertarVentaDesdeAlmacenAlternoMutationStack } from "../../../tanstack/VentasStack";

export const SelectAlmacen = () => {
  const { ProductosItemSelect } = useProductosStore();
  const { catidadInput, setCantidadInput } = useVentasStore();
  const { dataStockXAlmacenesYProducto: data, setStateModal } = useStockStore();
  const { mutate: doInsertarVentas, isPending } =
    useInsertarVentaDesdeAlmacenAlternoMutationStack();
  const ValidarCantidad = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setCantidadInput(value);
  };
  const maxStock = Math.max(1, ...(data?.map((i) => i.stock) || [1]));

  return (
    <Overlay>
      <Docket>
        <BtnClose funcion={() => setStateModal(false)}></BtnClose>
        <HazardEdge />
        <Header>
          <Badge>
            <Icon icon="mdi:warehouse" width="20" height="20" />
          </Badge>
          <div>
            <Eyebrow>No hay existencias aquí</Eyebrow>
            <ProductName>{ProductosItemSelect?.nombre}</ProductName>
          </div>
        </Header>
        <TransferTrack aria-hidden="true">
          <Forklift>
            <Icon icon="mdi:forklift" width="18" height="18" />
          </Forklift>
        </TransferTrack>
        <Message>
          Encontramos stock de este producto en otro almacén. Elige uno para
          continuar con la venta.
        </Message>
        <QtyRow>
          <QtyLabel htmlFor="cantidad-almacen">Cantidad</QtyLabel>
          <InputText2>
            <input
              id="cantidad-almacen"
              value={catidadInput}
              onChange={ValidarCantidad}
              className="form__field"
              type="number"
              min="1"
              placeholder="1"
            ></input>
          </InputText2>
        </QtyRow>
        <ListLabel>Almacenes disponibles</ListLabel>
        {data?.length > 0 ? (
          <List>
            {data.map((item, index) => (
              <Row
                key={index}
                onClick={() => !isPending && doInsertarVentas(item)}
                $disabled={isPending}
              >
                <RowMain>
                  <RowName>{item?.almacenes?.nombre}</RowName>
                  <RowStock>
                    {item?.stock} <unit>u.</unit>
                  </RowStock>
                </RowMain>
                <Bar>
                  <BarFill
                    style={{ width: `${(item.stock / maxStock) * 100}%` }}
                  />
                </Bar>
              </Row>
            ))}
          </List>
        ) : (
          <EmptyState>
            No hay stock disponible en ningún otro almacén.
          </EmptyState>
        )}
        <Footer>
          <Btn1
            titulo="Volver"
            funcion={() => setStateModal(false)}
            disabled={isPending}
          ></Btn1>
        </Footer>
      </Docket>
    </Overlay>
  );
};

const ACCENT = "#f2a900";
const ACCENT_TEXT = "#a15c00";
const GREEN = "#178a4c";
const GREEN_FILL = "#34c481";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(8, 9, 10, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

const Docket = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 22px 20px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bgtotal};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  animation: docket-in 0.22s cubic-bezier(0.2, 0.7, 0.3, 1) both;

  @keyframes docket-in {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const HazardEdge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 6px 6px 0 0;
  background: repeating-linear-gradient(
    -45deg,
    ${ACCENT},
    ${ACCENT} 8px,
    transparent 8px,
    transparent 16px
  );
  background-color: ${({ theme }) => theme.bgtotal};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-top: 4px;
`;

const Badge = styled.div`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in srgb, ${ACCENT} 18%, transparent);
  color: ${ACCENT_TEXT};
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 12.5px;
  color: ${ACCENT_TEXT};
  font-weight: 600;
  margin-bottom: 2px;
`;

const ProductName = styled.h2`
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
`;

const TransferTrack = styled.div`
  position: relative;
  height: 18px;
  margin: -6px 0 -4px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
    background-image: linear-gradient(
      to right,
      ${({ theme }) => theme.color2} 0 6px,
      transparent 6px 12px
    );
    background-size: 12px 1px;
    background-repeat: repeat-x;
  }
`;

const Forklift = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: ${ACCENT_TEXT};
  animation: drive 3.6s ease-in-out infinite;

  @keyframes drive {
    0%,
    100% {
      left: 0%;
    }
    45%,
    55% {
      left: calc(100% - 18px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    left: 8px;
  }
`;

const Message = styled.p`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.55;
  color: ${({ theme }) => theme.text};
  opacity: 0.65;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border-top: 1px solid ${({ theme }) => theme.color2};
  border-bottom: 1px solid ${({ theme }) => theme.color2};

  .form__field {
    width: 90px;
    text-align: right;
  }
`;

const QtyLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const ListLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text};
  opacity: 0.55;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
  margin-top: -8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color2};
    border-radius: 10px;
  }
`;

const Row = styled.div`
  padding: 12px 14px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bgtotal};
  background-color: color-mix(
    in srgb,
    ${({ theme }) => theme.text} 5%,
    ${({ theme }) => theme.bgtotal}
  );
  border: 1px solid ${({ theme }) => theme.color2};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? "" : ACCENT)};
    background-color: ${({ $disabled, theme }) =>
      $disabled
        ? ""
        : `color-mix(in srgb, ${theme.text} 9%, ${theme.bgtotal})`};
  }
`;

const RowMain = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const RowName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const RowStock = styled.span`
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${GREEN};

  unit {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    opacity: 0.55;
    margin-left: 2px;
  }
`;

const Bar = styled.div`
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color2};
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background-color: ${GREEN_FILL};
`;

const EmptyState = styled.div`
  padding: 20px 14px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  opacity: 0.55;
  border: 1px dashed ${({ theme }) => theme.color2};
  border-radius: 6px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;
