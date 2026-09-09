import styled, { useTheme } from "styled-components";
import { useVentasStore } from "../../store/VentasStore";
import { useMostrarVentaCompletaQueryStack } from "../../tanstack/VentasStack";
import { BeatLoader } from "react-spinners";
import writtenNumber from "written-number";

writtenNumber.defaults.lang = "es";

const formatMoney = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(n || 0);

export const TicketModal = () => {
  const { isTicketOpen, cerrarTicket } = useVentasStore();
  const { data, isLoading } = useMostrarVentaCompletaQueryStack();
  const theme = useTheme();

  if (!isTicketOpen) return null;

  return (
    <Overlay onClick={cerrarTicket}>
      <Ticket onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={cerrarTicket}>✕</CloseButton>

        {isLoading || !data ? (
          <LoaderContainer>
            <BeatLoader color={theme.text} size={8} />
          </LoaderContainer>
        ) : (
          <>
            {data.logo && (
              <LogoBox>
                <img src={data.logo} alt="logo" />
              </LogoBox>
            )}

            <EmpresaNombre>{data.nombre_empresa}</EmpresaNombre>
            <EmpresaInfo>
              {data.direccion_empresa ? `${data.direccion_empresa} - ` : ""}
              {data.pais}
            </EmpresaInfo>

            <ComprobanteBox>
              <strong>{data.nombre_comprobante}</strong>
              <span>{data.nro_comprobante}</span>
            </ComprobanteBox>

            <Divider dashed />

            <InfoRow>
              <span>FECHA</span>
              <span>
                {data.fecha} {data.hora}
              </span>
            </InfoRow>
            <InfoRow>
              <span>CAJERO</span>
              <span>{data.nombre_usuario}</span>
            </InfoRow>

            <Divider dashed />

            <SectionLabel>CLIENTE</SectionLabel>
            <InfoRow>
              <span>NOMBRE</span>
              <span>{data.nombre_cliente}</span>
            </InfoRow>
            <InfoRow>
              <span>C.C</span>
              <span>{data.cc}</span>
            </InfoRow>
            <InfoRow>
              <span>DIRECCIÓN</span>
              <span>{data.direccion_cliente}</span>
            </InfoRow>

            <Divider dashed />

            <ProductosTable>
              <thead>
                <tr>
                  <th>C</th>
                  <th>DESCRIPCIÓN</th>
                  <th>P.UN</th>
                  <th>TOT</th>
                </tr>
              </thead>
              <tbody>
                {data.productos?.map((p, i) => (
                  <tr key={i}>
                    <td>{p.cantidad}</td>
                    <td>{p.descripcion}</td>
                    <td>{formatMoney(p.precio_venta)}</td>
                    <td>{formatMoney(p.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </ProductosTable>

            <TotalesBox>
              <InfoRow>
                <span>SUBTOTAL</span>
                <span>{formatMoney(data.monto_total)}</span>
              </InfoRow>
              <TotalRow>
                <span>TOTAL</span>
                <span>{formatMoney(data.monto_total)}</span>
              </TotalRow>
            </TotalesBox>

            <SonTexto>
              SON {writtenNumber(Math.round(data.monto_total)).toUpperCase()}{" "}
              PESOS
            </SonTexto>

            <Divider dashed />

            <SectionLabel>FORMA DE PAGO</SectionLabel>
            {data.formas_pago?.length > 1 && <strong>Mixto</strong>}
            {data.formas_pago?.map((fp, i) => (
              <InfoRow key={i}>
                <span>{fp.metodo?.toUpperCase()}</span>
                <span>{formatMoney(fp.monto)}</span>
              </InfoRow>
            ))}

            {data.vuelto > 0 && (
              <InfoRow>
                <span>VUELTO</span>
                <span>{formatMoney(data.vuelto)}</span>
              </InfoRow>
            )}

            <Divider dashed />

            <PiePagina>{data.pie_pagina || "- - SoftCreate POS"}</PiePagina>
          </>
        )}
      </Ticket>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Ticket = styled.div`
  position: relative;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  width: 320px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  font-family: "Courier New", monospace;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"};
  box-shadow: ${({ theme }) =>
    theme.body === "#fff"
      ? "0px 10px 25px rgba(0, 0, 0, 0.12)"
      : "0px 10px 30px rgba(0, 0, 0, 0.6)"};
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const EmpresaNombre = styled.h3`
  text-align: center;
  margin: 4px 0 0;
  color: ${({ theme }) => theme.text};
`;

const EmpresaInfo = styled.p`
  text-align: center;
  margin: 2px 0 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

const ComprobanteBox = styled.div`
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"};
  border-radius: 6px;
  padding: 6px;
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const Divider = styled.div`
  border-top: ${({ dashed, theme }) => {
    const color = theme.body === "#fff" ? "#999" : "rgba(255,255,255,0.3)";
    return dashed ? `1px dashed ${color}` : `1px solid ${color}`;
  }};
  margin: 10px 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0;
  color: ${({ theme }) => theme.text};
`;

const SectionLabel = styled.p`
  color: ${({ theme }) => theme.text};
  opacity: 0.6;
  font-size: 11px;
  margin: 0 0 4px;
`;

const ProductosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  color: ${({ theme }) => theme.text};

  th {
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.text};
    padding-bottom: 4px;
    font-size: 11px;
  }
  td {
    padding: 3px 0;
    vertical-align: top;
  }
  th:last-child,
  td:last-child,
  th:nth-child(3),
  td:nth-child(3) {
    text-align: right;
  }
`;

const TotalesBox = styled.div`
  margin-top: 6px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
  color: ${({ theme }) => theme.text};
`;

const SonTexto = styled.p`
  text-align: center;
  font-style: italic;
  font-size: 11px;
  margin: 8px 0;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

const PiePagina = styled.p`
  text-align: center;
  font-size: 11px;
  margin-top: 8px;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;
