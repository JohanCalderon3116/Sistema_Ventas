import styled from "styled-components";
import { useProductosStore } from "../../../store/ProductosStore";
import { useVentasStore } from "../../../store/VentasStore";
import { useStockStore } from "../../../store/StockStore";
import { Btn1 } from "../../moleculas/Btn1";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { Icon } from "@iconify/react";
import { InputText2 } from "../formularios/InputText2";
import { useInsertarVentaDesdeAlmacenAlternoMutationStack } from "../../../tanstack/VentasStack";
import { useCierreCajaStore } from "../../../store/CierreCajaStore";
import { useMostrarSucursalesXEmpresaStack } from "../../../tanstack/SucursalesStack";

export const SelectAlmacen = () => {
  const { ProductosItemSelect } = useProductosStore();
  const { catidadInput, setCantidadInput } = useVentasStore();
  const { dataStockXAlmacenesYProducto, setStateModal } = useStockStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const { data: dataSucursales } = useMostrarSucursalesXEmpresaStack();
  const { mutate: doInsertarVentas, isPending } =
    useInsertarVentaDesdeAlmacenAlternoMutationStack();
  const idSucursal = dataCierreCaja?.caja?.id_sucursal;
  const todos = dataStockXAlmacenesYProducto ?? [];
  const data = todos.filter((i) => i.almacenes?.id_sucursal === idSucursal);
  const otras = todos.filter((i) => i.almacenes?.id_sucursal !== idSucursal);
  const nombreSucursal = (id) =>
    dataSucursales?.find((s) => s.id === id)?.nombre ?? "Otra sucursal";
  const otrasPorSucursal = Object.values(
    otras.reduce((acc, item) => {
      const id = item.almacenes?.id_sucursal;
      acc[id] = acc[id] || { id, items: [] };
      acc[id].items.push(item);
      return acc;
    }, {}),
  );

  const ValidarCantidad = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setCantidadInput(value);
  };
  const maxStock = Math.max(1, ...data.map((i) => i.stock));

  return (
    <Overlay>
      <Docket>
        <BtnClose funcion={() => setStateModal(false)}></BtnClose>
        <Header>
          <Badge>
            <Icon icon="lucide:warehouse" width="20" height="20" />
          </Badge>
          <div>
            <Eyebrow>Sin existencias en almacén actual</Eyebrow>
            <ProductName>{ProductosItemSelect?.nombre}</ProductName>
          </div>
        </Header>
        <Message>
          {data.length > 0
            ? "No hay existencias en el almacén actual, pero sí en estos almacenes de esta sucursal. Elige uno para continuar con la venta."
            : "Este producto no tiene existencias en esta sucursal."}
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

        {data.length > 0 && (
          <>
            <ListLabel>Almacenes de esta sucursal</ListLabel>
            <List>
              {data.map((item) => (
                <Row
                  key={item.id}
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
          </>
        )}

        {otrasPorSucursal.length > 0 && (
          <OtrasSucursales>
            <ListLabel>
              Sí hay existencias en otras sucursales (solo consulta)
            </ListLabel>
            {otrasPorSucursal.map((grupo) => (
              <div key={grupo.id}>
                <SucursalTitle>{nombreSucursal(grupo.id)}</SucursalTitle>
                {grupo.items.map((item) => (
                  <InfoRow key={item.id}>
                    <span>{item?.almacenes?.nombre}</span>
                    <span>
                      {item?.stock} <unit>u.</unit>
                    </span>
                  </InfoRow>
                ))}
              </div>
            ))}
          </OtrasSucursales>
        )}

        {data.length === 0 && otrasPorSucursal.length === 0 && (
          <EmptyState>
            No hay stock de este producto en ninguna sucursal.
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

const GREEN = "#10B981";
const GREEN_FILL = "#10B981";

const OtrasSucursales = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border: 1px dashed ${({ theme }) => theme.color2};
  border-radius: 8px;
`;

const SucursalTitle = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  padding: 2px 0;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(8, 9, 10, 0.55);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

const Docket = styled.div`
  position: relative;
  width: 100%;
  max-width: 390px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 22px 20px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgcards || theme.bgtotal};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
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
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.text};
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 12.5px;
  color: ${({ theme }) => theme.colorSubtitle};
  font-weight: 600;
  margin-bottom: 2px;
`;

const ProductName = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colorSubtitle};
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
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
  color: ${({ theme }) => theme.colorSubtitle};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
  margin-top: -8px;
`;

const Row = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:hover {
    border-color: ${({ $disabled, theme }) => ($disabled ? "" : theme.text)};
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
  font-size: 16px;
  font-weight: 700;
  color: ${GREEN};

  unit {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colorSubtitle};
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
  color: ${({ theme }) => theme.colorSubtitle};
  border: 1px dashed ${({ theme }) => theme.color2};
  border-radius: 10px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;
