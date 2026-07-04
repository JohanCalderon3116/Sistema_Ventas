import { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useClientesProveedoresStore,
  SelectList,
  InsertarMovimientosCreditos,
  useFormattedDate,
  BtnClose,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCreditosStore } from "../../../store/CreditosStore";
import { toast, Toaster } from "sonner";
import { BeatLoader } from "react-spinners";

export function RegistrarAbonoCreditos({
  onClose,
  dataSelect,
  setIsExploding,
}) {
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const {
    insertarCliPro,
    editarCliPro,
    mostrarCliPro,
    cliproItemSelect,
    selectCliPro,
  } = useClientesProveedoresStore();
  const { dataempresa } = useEmpresaStore();
  const fecha = useFormattedDate();
  const {
    insertarCredito,
    datacreditos,
    creditosItemSelect,
    setCreditosItemSelect,
  } = useCreditosStore();
  const theme = useTheme();

  const { data: dataclipro, isLoading } = useQuery({
    queryKey: [
      "mostrar usuarios",
      { id_empresa: dataempresa?.id, tipo: "cliente" },
    ],
    queryFn: () =>
      mostrarCliPro({
        id_empresa: dataempresa?.id,
        tipo: "cliente",
      }),
  });

  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: "insertar abono credito",
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos registrar el abono al crédito, algo falló en el proceso ${error.message} 😯`,
      );
    },
    onSuccess: () => {
      (toast.success("El abono al crédito quedó registrado correctamente 🫶"),
        cerrarFormulario());
      queryClient.invalidateQueries(["mostrar creditos"]);
    },
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  const cerrarFormulario = () => {
    onClose();
    setIsExploding(true);
  };
  async function insertar(data) {
    const p = {
      id_credito: creditosItemSelect?.id,
      tipo_movimiento: "abono",
      valor: data.valor,
      observacion: data.observacion,
      fecha_movimiento: fecha,
    };
    await InsertarMovimientosCreditos(p);
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>Regitrar abono de crédito</h1>
            </section>
            <section>
              <BtnClose funcion={onClose}></BtnClose>
            </section>
          </div>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <ContainerSelector>
                <label>Clientes: </label>
                <SelectList
                  data={datacreditos}
                  itemSelect={creditosItemSelect}
                  onSelect={setCreditosItemSelect}
                  displayField="nombres"
                ></SelectList>
              </ContainerSelector>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="number"
                    placeholder="Abono"
                    {...register("valor", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Volor Abono: </label>
                  {errors.valor?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="observacion"
                    {...register("observacion", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Observación: </label>
                  {errors.observacion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <Btn1
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#3300E3"
              />
            </section>
          </form>
        </div>
      )}
    </Container>
  );
}
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
  }
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;

  svg {
    font-size: 25px;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 40px;
    font-size: 28px;
  }
`;
const PictureContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  border: 2px dashed #f9d70b;
  border-radius: 5px;
  background-color: rgba(249, 215, 11, 0.1);
  padding: 8px;
  position: relative;
  gap: 3px;
  margin-bottom: 8px;

  .ContentImage {
    overflow: hidden;
    img {
      width: 100%;
      object-fit: contain;
    }
  }
  input {
    display: none;
  }
`;
export const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;
