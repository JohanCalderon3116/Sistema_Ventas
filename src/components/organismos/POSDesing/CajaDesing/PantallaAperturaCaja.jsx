import styled from "styled-components";
import { InputText2 } from "../../formularios/InputText2";
import { Btn1 } from "../../../moleculas/Btn1";
import { useState } from "react";
import { useUsuariosStore } from "../../../../store/UsuariosStore";
import { useCajasStore } from "../../../../store/CajaStore";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const PantallaAperturaCaja = () => {
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const queryClient = useQueryClient();
  const { datausuarios } = useUsuariosStore();
  const { dataCaja } = useCajasStore();
  const { aperturarCaja } = useCierreCajaStore();
  const insertar = async () => {
    const p = {
      efectivo_inicial: montoEfectivo,
      id_usuario: datausuarios?.id,
      id_caja: dataCaja?.id,
    };
    aperturarCaja(p);
  };
  const mutation = useMutation({
    mutationKey: ["aperturar caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("Caja aperturada correctamente :v");
      queryClient.invalidateQueries("mostrar cierre de caja");
    },
    onError: () => {
      toast.error("Error al aperturar caja :'/");
    },
  });
  return (
    <Container>
      <section className="area1">
        <span className="title">Aperturar caja con: </span>
        <InputText2>
          <input
            onChange={(e) => setMontoEfectivo(parseFloat(e.target.value))}
            type="number"
            placeholder="0.00"
            className="form__field"
          />
        </InputText2>
        <span>En efectivo</span>
        <article className="contentbtn">
          <Btn1
            titulo="Omitir"
            funcion={() => {
              setMontoEfectivo(0);
              mutation.mutateAsync();
            }}
          ></Btn1>
          <Btn1
            funcion={() => {
              mutation.mutateAsync();
            }}
            titulo="Aperturar"
            color="#ffffff"
            bgcolor="#1da139"
            border="2px"
          ></Btn1>
        </article>
      </section>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  align-items: center;
  justify-content: center;
  display: flex;
  .area1 {
    display: flex;
    gap: 12px;
    flex-direction: column;
    .title {
      font-size: 19px;
      font-weight: bold;
    }
    .contentbtn {
      display: flex;
      gap: 12px;
    }
  }
`;
