import { Icon } from "@iconify/react/dist/iconify.js";
import styled from "styled-components";
import { InputText2 } from "../../formularios/InputText2";
import { Btn1 } from "../../../moleculas/Btn1";
import { useEffect } from "react";
import { useMetodosPagoStore } from "../../../../store/MetodosPagoStore";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { useEmpresaStore } from "../../../../store/EmpresaStore";
import { useAperturarCajasMutationStack } from "../../../../tanstack/CajasStack";

export function CardListCajas({
  title,
  subtitle,
  bgcolor,
  funcion,
  sucursal,
  state,
  item,
}) {
  const { dataMetodosPago, mostrarMetodosPago } = useMetodosPagoStore();
  const { setMontoEfectivo } = useMovCajaStore();
  const { dataempresa } = useEmpresaStore();
  const mutation = useAperturarCajasMutationStack(item);

  useEffect(() => {
    if (!dataMetodosPago) {
      mostrarMetodosPago({
        id_empresa: dataempresa?.id,
      });
    }
  }, [dataempresa?.id]);

  return (
    <Container $bgcolor={bgcolor} $state={!state} onClick={funcion}>
      <article className="content-wrapper">
        <section className="badge-container">
          <span className="badge-button">
            {title} {state ? "(aperturada)" : "(libre)"}
          </span>
        </section>
        <span className="sucursal-text">Sucursal: {sucursal}</span>
        {subtitle != 0 && (
          <section className="title-section">
            <Icon
              className="subtitle icon-status"
              icon="pepicons-print:open"
              width="20"
              height="20"
            />
            <span className="label">Caja aperturada por:</span>
            <span className="subtitle">{subtitle}</span>
          </section>
        )}
        {!state && (
          <section className="contentInputs">
            <span className="title">Aperturar caja con:</span>
            <InputText2>
              <input
                className="form__field"
                onChange={(e) =>
                  setMontoEfectivo(parseFloat(e.target.value) || 0)
                }
                type="number"
                placeholder="0.00"
              />
            </InputText2>
          </section>
        )}
        {!state && (
          <article className="contentbtn">
            <Btn1
              titulo="OMITIR"
              funcion={() => {
                setMontoEfectivo(0);
                mutation.mutateAsync();
              }}
            />
            <Btn1
              titulo="APERTURAR"
              color="#ffffff"
              border="2px"
              bgcolor="#202020"
              funcion={() => mutation.mutateAsync()}
            />
          </article>
        )}
      </article>
    </Container>
  );
}

const Container = styled.section`
  position: relative;
  display: flex;
  gap: 1.25rem;
  overflow: hidden;
  padding: 1rem;
  border-radius: 1rem;
  cursor: pointer;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff" ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"};
  box-shadow: ${({ theme }) =>
    theme.body === "#fff"
      ? "0 5px 16px rgba(0,0,0,0.05)"
      : "0 5px 16px rgba(0,0,0,0.18)"};
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  transform: translateY(-2px);
  &:hover {
    border-color: ${({ $bgcolor }) =>
      $bgcolor === "#a94d4d" ? "rgba(169,77,77,0.20)" : "rgba(83,155,91,0.20)"};
    box-shadow: ${({ theme }) =>
      theme.body === "#fff"
        ? "0 7px 20px rgba(0,0,0,0.06)"
        : "0 7px 20px rgba(0,0,0,0.22)"};
    &::before {
      opacity: 0.8;
    }
  }
  &:active {
    transform: translateY(0);
  }
  &::before {
    content: "";
    position: absolute;
    width: 60px;
    height: 60px;
    right: -15px;
    bottom: -15px;
    border-radius: 50%;
    background: ${({ $bgcolor }) =>
      $bgcolor === "#a94d4d"
        ? "rgba(169,77,77,0.055)"
        : "rgba(83,155,91,0.055)"};
    opacity: 0.45;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  .content-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    width: 100%;
  }
  .contentInputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .form__field:focus {
      font-weight: 700;
      border: 1px solid
        ${({ $bgcolor }) =>
          $bgcolor === "#a94d4d"
            ? "rgba(169,77,77,0.45)"
            : "rgba(83,155,91,0.45)"};
      box-shadow: ${({ $bgcolor }) =>
        $bgcolor === "#a94d4d"
          ? "0 0 0 3px rgba(169,77,77,0.045)"
          : "0 0 0 3px rgba(83,155,91,0.045)"};
    }
  }
  .contentbtn {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .badge-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .badge-button {
    font-weight: 700;
    text-transform: uppercase;
    color: ${({ $bgcolor }) => $bgcolor};
  }
  .sucursal-text {
    font-weight: 600;
    opacity: 0.85;
  }
  .title-section {
    display: flex;
    gap: 5px;
    align-items: center;
    .label {
      font-size: 14px;
      opacity: 0.58;
    }
    .subtitle {
      font-weight: 600;
      font-size: 15px;
      opacity: 0.82;
    }
    .icon-status {
      color: ${({ $bgcolor }) => $bgcolor};
      opacity: 0.72;
    }
  }
  .title {
    font-weight: 600;
    font-size: 14px;
    opacity: 0.75;
  }
  .emoji-container {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 2rem;
  }
  .character-image {
    height: 100%;
    position: relative;
  }
  @media (max-width: 600px) {
    padding: 14px;
    .content-wrapper {
      gap: 12px;
    }
    .contentbtn {
      width: 100%;
    }
  }
`;
