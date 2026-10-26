import styled, { useTheme } from "styled-components";
import { Btn1 } from "../components/moleculas/Btn1";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { useUpdatEmpresaTicketMutateStack } from "../tanstack/EmpresaStack";
import { ImageSelector } from "../hooks/useImageSelector";
import { useGlobalStore } from "../store/GlobalStore";
import { BeatLoader } from "react-spinners";

export const ConfiguracionTicket = () => {
  const theme = useTheme();
  const { dataempresa } = useEmpresaStore();
  const { fileurl } = useGlobalStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombre: dataempresa?.nombre,
      id_fiscal: dataempresa?.id_fiscal,
      direccion_fiscal: dataempresa?.direccion_fiscal,
      nombre_moneda: dataempresa?.nombre_moneda,
      pie_pagina_ticket: dataempresa?.pie_pagina_ticket,
    },
  });
  const { mutate, isPending } = useUpdatEmpresaTicketMutateStack();

  return (
    <Container>
      <Toaster richColors position="top-center" />
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <div className="left-section">
          <Contentguia>
            <span className="title">Ticket</span>
            <span className="format-title">
              puedes modificar detalles de tu ticket
            </span>
          </Contentguia>
          <ImageSelector fileurl={fileurl || dataempresa?.logo} />
          <form className="receipt-content" onSubmit={handleSubmit(mutate)}>
            <Btn1 bgcolor={"#18181B"} color="255,255,255" titulo={"Guardar"} />
            <br></br>
            <div className="company-info">
              <div className="company-name">
                <input
                  type="text"
                  placeholder="Ingrese el nombre de la empresa"
                  {...register("nombre", {
                    required: "Campo requerido",
                  })}
                />
                {errors.nombre && <p>{errors.nombre.message}</p>}
                <div className="tech-label">
                  <span>NombreEmpresa</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="company-details">
                <input
                  type="text"
                  placeholder="Ingrese el RUC"
                  {...register("id_fiscal", {
                    required: "Campo requerido",
                  })}
                />
                {errors.id_fiscal && <p>{errors.id_fiscal.message}</p>}
                <div className="tech-label">
                  <span>NIT</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="company-details">
                <input
                  type="text"
                  placeholder="Ingrese la dirección fiscal"
                  {...register("direccion_fiscal", {
                    required: "Campo requerido",
                  })}
                />
                {errors.direccion_fiscal && (
                  <p>{errors.direccion_fiscal.message}</p>
                )}
                <div className="tech-label">
                  <span>Dirección</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>
            <div className="ticket-number">
              TICKET - T0001
              <div className="tech-label">
                <span>Ticket</span>
                <span className="tech-type">(id)</span>
              </div>
              <div className="connector-line" />
            </div>
            <div className="divider"></div>
            <div className="details-section">
              <div className="details-row">
                <div className="details-label">Cajero</div>
                <div className="details-colon">:</div>
                <div className="details-value">Nombre del Cajero</div>
                <div className="tech-label">
                  <span>Cajero</span>
                  <span className="tech-type">(text)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="details-row">
                <div className="details-label">Fecha Emisión</div>
                <div className="details-colon">:</div>
                <div className="details-value">19/02/2018</div>
                <div className="tech-label">
                  <span>Fecha</span>
                  <span className="tech-type">(date)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="details-row">
                <div className="details-label">Cliente</div>
                <div className="details-colon">:</div>
                <div className="details-value">NOMBRE DEL CLIENTE</div>
                <div className="tech-label">
                  <span>Cliente</span>
                  <span className="tech-type">(text)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>
            <div className="divider"></div>
            <table className="products-table">
              <thead>
                <tr>
                  <th>
                    Cant.
                    <div className="tech-label">
                      <span>Cantidad</span>
                      <span className="tech-type">(number)</span>
                    </div>
                    <div className="connector-line" />
                  </th>
                  <th>
                    Descripción
                    <div className="tech-label">
                      <span>Producto</span>
                      <span className="tech-type">(text)</span>
                    </div>
                    <div className="connector-line" />
                  </th>
                  <th>
                    Importe
                    <div className="tech-label">
                      <span>Precio</span>
                      <span className="tech-type">(currency)</span>
                    </div>
                    <div className="connector-line" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Gaseosa Coca Cola x 1 Lt</td>
                  <td>CO$ 5.000.00</td>
                </tr>
              </tbody>
            </table>
            <div className="summary-section">
              <div className="summary-row">
                <div>Sub Total:</div>
                <div>CO$ 5.000.00</div>
                <div className="tech-label">
                  <span>SubTotal</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="summary-row">
                <div>Descuento:</div>
                <div>CO$. 0.00</div>
                <div className="tech-label">
                  <span>Descuento</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="summary-row total">
                <div>TOTAL:</div>
                <div>CO$ 5.000.00</div>
                <div className="tech-label">
                  <span>Total</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>
            <div className="payment-info">
              <div className="son-text">
                SON: VEINTISEIS CON 50/100
                <input
                  type="text"
                  placeholder="Ingrese nombre moneda"
                  {...register("nombre_moneda", {
                    required: "Campo requerido",
                  })}
                />
                {errors.nombre_moneda && <p>{errors.nombre_moneda.message}</p>}
                <div className="tech-label">
                  <span>Moneda</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="payment-row">
                <div>EFECTIVO:</div>
                <div>S/. 50</div>
                <div className="tech-label">
                  <span>Efectivo</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="payment-row">
                <div>VUELTO:</div>
                <div>S/. 14</div>
                <div className="tech-label">
                  <span>Vuelto</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="payment-row">
                <div>Tipo de Pago:</div>
                <div>Efectivo</div>
                <div className="tech-label">
                  <span>TipoPago</span>
                  <span className="tech-type">(text)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>
            <div className="divider"></div>
            <div className="footer-info">
              <div className="footer-row">
                <input
                  type="text"
                  placeholder="Ingrese un pie de pagina"
                  {...register("pie_pagina_ticket", {
                    required: "Campo requerido",
                  })}
                />
                {errors.pie_pagina_ticket && (
                  <p>{errors.pie_pagina_ticket.message}</p>
                )}
                <div className="tech-label">
                  <span>Agradecimiento</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>
            <div className="footer-stars">
              ************************************************
            </div>
            <div className="qr-code">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Codigo_QR.svg/500px-Codigo_QR.svg.png"
                alt="QR Code"
              />
              <div className="tech-label">
                <span>QR</span>
                <span className="tech-type">(image)</span>
              </div>
              <div className="connector-line" />
            </div>
          </form>
        </div>
      )}
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  position: relative;
  color: ${({ theme }) => theme.text};
  padding: 40px 20px;
  input {
    width: 90%;
    padding: 8px 12px;
    font-size: 12px;
    text-align: center;
    border: 1.5px solid ${({ theme }) => theme.color2};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    transition: all 0.2s ease-out;
    &::placeholder {
      color: ${({ theme }) => theme.colorSubtitle};
    }
    &:hover,
    &:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
      transform: translateY(-1px);
    }
    &:focus {
      outline: none;
    }
  }
  .left-section {
    width: 400px;
    margin: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: ${({ theme }) => theme.bgcards};
    color: ${({ theme }) => theme.colortitlecard};
    border: 1px solid ${({ theme }) => theme.color2};
    padding: 32px 24px;
    border-radius: 16px;
    box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .company-info {
    width: 100%;
    max-width: 600px;
    text-align: center;
    margin-bottom: 24px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .company-name {
    font-weight: bold;
    position: relative;
    input {
      font-size: 15px;
      font-weight: 700;
    }
  }
  .company-details {
    font-size: 12px;
    position: relative;
  }
  .ticket-number {
    font-weight: bold;
    font-size: 15px;
    letter-spacing: 1px;
    margin: 16px 0;
    padding: 8px 16px;
    background: ${({ theme }) => theme.bgAlpha};
    border-radius: 8px;
    position: relative;
    color: ${({ theme }) => theme.colortitlecard};
  }
  .divider {
    width: 100%;
    max-width: 600px;
    border-top: 1.5px dashed ${({ theme }) => theme.color2};
    margin: 14px 0;
  }
  .details-section {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    background: ${({ theme }) => theme.bgAlpha};
    border-radius: 10px;
    padding: 4px 12px;
  }
  .details-row {
    display: grid;
    grid-template-columns: 120px 20px 1fr;
    padding: 10px 0;
    border-bottom: 1px dotted ${({ theme }) => theme.color2};
    align-items: center;
    position: relative;
    &:last-child {
      border-bottom: none;
    }
  }
  .details-label {
    font-weight: 500;
    font-size: 12.5px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
  .details-colon {
    text-align: center;
  }
  .details-value {
    font-weight: 600;
    color: ${({ theme }) => theme.colorsubtitlecard};
  }
  .products-table {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 10px;
    overflow: hidden;
    th,
    td {
      padding: 12px 10px;
      text-align: left;
      position: relative;
    }
    th {
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${({ theme }) => theme.colorSubtitle};
      background: ${({ theme }) => theme.bgAlpha};
      border-bottom: 1px solid ${({ theme }) => theme.color2};
    }
    td {
      font-size: 13px;
      color: ${({ theme }) => theme.colorsubtitlecard};
      border-bottom: 1px dotted ${({ theme }) => theme.color2};
    }
  }
  .summary-section {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: ${({ theme }) => theme.bgAlpha};
    border-radius: 10px;
    padding: 10px 14px;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    margin: 4px 0;
    padding: 6px 0;
    position: relative;
    color: ${({ theme }) => theme.colorsubtitlecard};
  }
  .summary-row.total {
    font-weight: bold;
    font-size: 15px;
    color: ${({ theme }) => theme.colortitlecard};
    border-top: 2px solid ${({ theme }) => theme.color2};
    margin-top: 8px;
    padding-top: 10px;
  }
  .payment-info {
    width: 100%;
    max-width: 600px;
    font-size: 12px;
    margin: 16px auto;
    color: ${({ theme }) => theme.colorsubtitlecard};
  }
  .son-text {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-style: italic;
    position: relative;
  }
  .payment-row {
    display: flex;
    justify-content: space-between;
    margin: 6px 0;
    padding: 6px 0;
    position: relative;
  }
  .footer-info {
    width: 100%;
    max-width: 600px;
    margin: 24px auto 0;
  }
  .footer-row {
    width: 100%;
    text-align: center;
    padding: 5px 0;
    margin: 2px 0;
    font-size: 12px;
    position: relative;
  }
  .footer-stars {
    width: 100%;
    max-width: 600px;
    text-align: center;
    color: ${({ theme }) => theme.colorSubtitle};
    letter-spacing: 2px;
    margin: 16px auto;
  }
  .qr-code {
    width: 130px;
    height: 130px;
    position: relative;
    margin-top: 8px;
    padding: 10px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    img {
      max-width: 100%;
      height: auto;
    }
  }
  .receipt-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .tech-label {
    display: none;
  }
  .connector-line {
    display: none;
  }
`;

const Contentguia = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px dashed ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.colortitlecard};
  .title {
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.text};
  }
  .format-title {
    color: ${({ theme }) => theme.colorSubtitle};
    margin-bottom: 4px;
    font-size: 13px;
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
  color: ${({ theme }) => theme.text};
`;
