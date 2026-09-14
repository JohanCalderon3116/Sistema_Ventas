import styled, { useTheme } from "styled-components";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useCreditosStore } from "../../store/CreditosStore";
import { useMovimientosCreditosStore } from "../../store/MovimientosCreditosStore";
import { useObtenerMovimientosCreditoQueryStack } from "../../tanstack/CreditosStack";

const formatMoney = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(n || 0);

export function HistorialCreditoModal() {
  const theme = useTheme();
  const [tab, setTab] = useState("venta");
  const { isHistorialOpen, cerrarHistorial } = useMovimientosCreditosStore();
  const { creditosItemSelect } = useCreditosStore();
  const { abrirTicketCredito } = useMovimientosCreditosStore();
  const { data, isLoading } = useObtenerMovimientosCreditoQueryStack();

  if (!isHistorialOpen) return null;

  const movimientos = data?.filter((m) => m.tipo_movimiento === tab) ?? [];

  return (
    <Overlay onClick={cerrarHistorial}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={cerrarHistorial}>✕</CloseButton>
        <Titulo>{creditosItemSelect?.clientes_proveedores?.nombres}</Titulo>

        <Tabs>
          <TabBtn $active={tab === "venta"} onClick={() => setTab("venta")}>
            Ventas
          </TabBtn>
          <TabBtn $active={tab === "abono"} onClick={() => setTab("abono")}>
            Abonos
          </TabBtn>
        </Tabs>

        {isLoading ? (
          <LoaderContainer>
            <BeatLoader color={theme.text} size={8} />
          </LoaderContainer>
        ) : movimientos.length === 0 ? (
          <Vacio>
            No hay {tab === "venta" ? "ventas" : "abonos"} registrados
          </Vacio>
        ) : (
          <Lista>
            {movimientos.map((m) => (
              <Item
                key={m.id}
                $clickable={tab === "venta"}
                onClick={() =>
                  tab === "venta" && abrirTicketCredito(m.id_venta)
                }
              >
                <Fila>
                  <span>
                    {new Date(m.fecha_movimiento).toLocaleDateString("es-CO")}{" "}
                    {new Date(m.fecha_movimiento).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <strong>{formatMoney(m.valor)}</strong>
                </Fila>
                {m.observacion && m.observacion !== "-" && (
                  <Observacion>{m.observacion}</Observacion>
                )}
              </Item>
            ))}
          </Lista>
        )}
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Panel = styled.div`
  position: relative;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  width: 380px;
  max-height: 80vh;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const Titulo = styled.h3`
  margin: 0 0 12px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.color2 : "transparent"};
  color: ${({ theme }) => theme.text};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

const Lista = styled.div`
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(161, 161, 161, 0.32);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  &:hover {
    background: ${({ $clickable }) =>
      $clickable ? "rgba(255,255,255,0.05)" : "transparent"};
  }
`;

const Fila = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Observacion = styled.small`
  opacity: 0.6;
  margin-top: 4px;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const Vacio = styled.p`
  text-align: center;
  opacity: 0.6;
  padding: 20px 0;
`;
