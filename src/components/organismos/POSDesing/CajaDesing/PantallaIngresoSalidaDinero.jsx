import styled from "styled-components";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { Btn1, InputText2, useCajasStore, VolverBtn } from "../../../../index";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
export const PantallaIngresoSalidaDinero = () => {
  const { tipoRegistro, setStateIngresoSalida, insertarIngresoSalidaCaja } =
    useCierreCajaStore();
  const [startDate, setStartDate] = useState(new Date());
  const { dataCaja } = useCajasStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const insertar = async (data) => {
    const p = {
      fecha: startDate,
      monto: parseFloat(data.monto),
      descripcion: data.motivo,
      id_caja: dataCaja?.id,
      tipo: tipoRegistro,
    };
    await insertarIngresoSalidaCaja(p);
  };

  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar ingresos salidas caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("Movimiento registrado :p");
      reset();
    },
    onError: () => {
      toast.error("Error al registrar");
    },
  });
  const manejadorEnvio = (data) => {
    doInsertar(data);
  };
  return (
    <Container>
      <VolverBtn funcion={setStateIngresoSalida}></VolverBtn>
      <span className="title">
        {tipoRegistro === "ingreso"
          ? "Ingresar dinero a caja"
          : "Retirar dinero de caja"}
      </span>
      <form action="" onSubmit={handleSubmit(manejadorEnvio)}>
        <section className="area1">
          <span>Monto: </span>
          <InputText2>
            <input
              type="number"
              className="form__field"
              placeholder="0.00"
              {...register("monto", { required: true })}
            />
            {errors.monto?.type === "required" && <span>Campo requerido</span>}
          </InputText2>

          <StyleDataPickerWrapper>
            <StyleDataPicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
            ></StyleDataPicker>
          </StyleDataPickerWrapper>
          <span>Motivo (Puede ser blanco)</span>
          <InputText2>
            <textarea
              type="text"
              className="form__field"
              rows="3"
              placeholder="Motivo"
              {...register("motivo")}
            />
          </InputText2>
          <article className="contentbtn">
            <Btn1
              color="#fff"
              border="2px"
              bgcolor="#1da939"
              titulo="Registrar"
            ></Btn1>
          </article>
        </section>
      </form>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  position: absolute;
  background-color: ${({ theme }) => theme.bgtotal};
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .area1 {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }
  .contentbtn {
    margin-top: 15px;
    display: flex;
    gap: 12px;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
`;

const StyleDataPickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const StyleDataPicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.color2};
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0px 0px 5px ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }
`;
