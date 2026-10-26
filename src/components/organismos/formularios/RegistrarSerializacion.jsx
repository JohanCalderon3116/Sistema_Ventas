import { useState } from "react";
import { v } from "../../../styles/variables";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import {
  InputText,
  Btn1,
  useGlobalStore,
  useAsignacionCajaSucursalesStore,
  useEditarSerealizaciontMutationStack,
} from "../../../index";
import { BtnClose } from "../../ui/buttons/BtnClose";

export const RegistrarSerializacion = () => {
  const { setStateClose, itemSelect } = useGlobalStore();
  const [cantidadNumeros, setCantidadNumeros] = useState(
    itemSelect?.cantidad_numeros,
  );
  const [correlativo, setCorrelativo] = useState(itemSelect?.correlativos);
  const [serie, setSerie] = useState(itemSelect?.serie);
  const formatearCorrelativo = (numero, longitud) => {
    return String(numero).padStart(longitud, "0");
  };
  const { mutate } = useEditarSerealizaciontMutationStack();
  const { sucursalesItemSelectAsignada } = useAsignacionCajaSucursalesStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      cantidad_numeros: itemSelect?.cantidad_numeros,
      correlativos: itemSelect?.correlativos,
      serie: itemSelect?.serie,
      sucursal_id: sucursalesItemSelectAsignada?.id_sucursal,
    },
  });
  return (
    <Container>
      <section className="sub-container">
        <div className="comprobante">
          <BtnClose color={"#09090B"} funcion={() => setStateClose(false)} />
          <span className="title">Comprobante</span>
          <div className="tipo"> {itemSelect?.tipo_comprobantes?.nombre} </div>
          <div className="numero">
            <span>{serie}-</span>
            <span>{formatearCorrelativo(correlativo, cantidadNumeros)}</span>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit(mutate)}>
          <article>
            <InputText icono={<v.iconoflechaderecha />}>
              <input
                className="form__field"
                placeholder="Cantidad de numeros"
                type="number"
                value={cantidadNumeros}
                {...register("cantidad_numeros", {
                  required: true,
                })}
                onChange={(e) =>
                  setCantidadNumeros(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <label className="form__label">Cantidad de numeros</label>
              {errors.cantidad_numeros?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText>
          </article>
          <article>
            <InputText icono={<v.iconoflechaderecha />}>
              <input
                className="form__field"
                placeholder="Correlativos"
                type="number"
                value={correlativo}
                {...register("correlativos", {
                  required: true,
                })}
                onChange={(e) =>
                  setCorrelativo(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
              <label className="form__label">Correlativo</label>
              {errors.correlativos?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText>
          </article>
          <article>
            <InputText icono={<v.iconoflechaderecha />}>
              <input
                className="form__field"
                placeholder="Serie"
                type="text"
                value={serie}
                {...register("serie", {
                  required: true,
                })}
                onChange={(e) => setSerie(e.target.value.toUpperCase())}
              />
              <label className="form__label">Serie</label>
              {errors.serie?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText>
          </article>
          <div className="buttons">
            <Btn1 titulo={"Guardar"} bgcolor={"#18181B"} color={"#FFFFFF"} />
          </div>
        </form>
      </section>
    </Container>
  );
};

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background-color: rgba(9, 9, 11, 0.55);
  backdrop-filter: blur(5px);
  input {
    color: ${({ theme }) => theme.text};
  }
  .sub-container {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    background: ${({ theme }) => theme.bgcards || theme.bgtotal};
    border: 1px solid ${({ theme }) => theme.color2};
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
    align-items: center;
    justify-content: center;
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
  .comprobante {
    display: flex;
    gap: 8px;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    border: 1px solid #e4e4e7;
    padding: 16px;
    border-radius: 12px;
    width: 300px;
    text-align: center;
    position: relative;
    margin-bottom: 20px;
    .title {
      color: #09090b;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 0.04em;
    }
    .tipo {
      background: #18181b;
      color: #ffffff;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .numero {
      margin-top: 10px;
      font-size: 18px;
      font-weight: 700;
      background: #f8fafc;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1.5px solid #27272a;
      span:first-child {
        color: #7c3aed;
      }
      span:last-child {
        color: #09090b;
      }
    }
  }
  .checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .buttons {
    display: flex;
    margin-top: 20px;
    gap: 10px;
  }
`;
