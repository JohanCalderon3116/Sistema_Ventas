import styled, { useTheme } from "styled-components";
import {
  InputText,
  Btn1,
  useCajasStore,
  SelectList,
  useSucursalesStore,
  PermisosUser,
  useInsertarUsuariosPorEmpresaMutationStack,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { Toaster } from "sonner";
import { Icon } from "@iconify/react";
import { BeatLoader } from "react-spinners";
import {
  useMostrarCajaPorSucursalQueryStack,
  useMostrarSucursalesXEmpresaStack,
} from "../../../tanstack/SucursalesStack";
export function RegistrarUsuarios({ accion, dataSelect, onClose }) {
  const { cajaSelelctItem, setCajaSelelctItem } = useCajasStore();
  const { sucursalesItemSelect, selectSucursal } = useSucursalesStore();
  const theme = useTheme();
  const { data: dataSucursales, isLoading: isLoadingSucursales } =
    useMostrarSucursalesXEmpresaStack();
  const { data: dataCaja, isLoading: isLoadingSCaja } =
    useMostrarCajaPorSucursalQueryStack();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } =
    useInsertarUsuariosPorEmpresaMutationStack({ accion, dataSelect, onClose });
  const manejadorInsertar = (data) => {
    doInsertar(data);
  };
  const isLoading = isLoadingSucursales || isLoadingSCaja;
  if (isLoading) {
    return (
      <Container>
        <Toaster richColors></Toaster>
        <ConteinerLoader>
          <span>
            <strong>Cargando</strong>
          </span>
          <BeatLoader color={theme.color1 || "#8B5CF6"} size={8} />
        </ConteinerLoader>
      </Container>
    );
  }
  return (
    <Container>
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.color1 || "#8B5CF6"} size={8} />
        </ConteinerLoader>
      ) : (
        <Form onSubmit={handleSubmit(manejadorInsertar)}>
          <Header>
            <Title>
              {accion == "Editar" ? "Editar Usuarios" : "Registrar Usuario"}
            </Title>
            <BtnClose funcion={onClose}></BtnClose>
          </Header>
          <section className="main">
            <section className="area1">
              <article>
                <InputText
                  icono={<Icon icon="lucide:user-plus" height="24"></Icon>}
                >
                  <input
                    className="form__field"
                    defaultValue={accion === "Editar" ? dataSelect?.email : ""}
                    type="email"
                    placeholder="Correo"
                    disabled={accion === "Editar"}
                    {...register("email", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Correo</label>
                  {errors.email?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText
                  icono={
                    <Icon icon="lucide:key-round" height="24"></Icon>
                  }
                >
                  <input
                    className="form__field"
                    defaultValue=""
                    type="password"
                    placeholder="Contraseña"
                    disabled={accion === "Editar"}
                    {...register("pass", {
                      required: accion === "Editar" ? false : true,
                    })}
                  />
                  <label className="form__label">Contraseña</label>
                  {errors.pass?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText
                  icono={
                    <Icon icon="lucide:user" height="24"></Icon>
                  }
                >
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.usuario : ""
                    }
                    type="text"
                    placeholder="Nombres"
                    {...register("nombres", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Nombres</label>
                  {errors.nombres?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<Icon icon="lucide:id-card" height="24"></Icon>}>
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.nro_doc : ""
                    }
                    type="number"
                    placeholder="C.C"
                    {...register("nro_doc", {
                      required: true,
                    })}
                  />
                  <label className="form__label">C.C</label>
                  {errors.nombres?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText
                  icono={<Icon icon="lucide:phone" height="24"></Icon>}
                >
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.telefono : ""
                    }
                    type="number"
                    placeholder="telefono"
                    {...register("telefono", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Telefono</label>
                  {errors.telefono?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <span>Asignación de caja</span>
              <article className="contentasignacion">
                <span>Sucursal: </span>
                <SelectList
                  onSelect={selectSucursal}
                  itemSelect={sucursalesItemSelect}
                  displayField="nombre"
                  data={dataSucursales}
                ></SelectList>
              </article>
              <article className="contentasignacion">
                <span>Caja: </span>
                <SelectList
                  onSelect={setCajaSelelctItem}
                  itemSelect={cajaSelelctItem}
                  displayField="descripcion"
                  data={dataCaja}
                ></SelectList>
              </article>
              <Btn1 titulo="Guardar" color="#fff" bgcolor="#18181B"></Btn1>
            </section>
            <section className="area2">
              <PermisosUser></PermisosUser>
            </section>
          </section>
        </Form>
      )}
    </Container>
  );
}

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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: ${({ theme }) => theme.bgcards || theme.body};
  padding: 24px;
  border-radius: 16px;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
  width: 100%;
  margin: 10px;
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
  .main {
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    .area1 {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
    }
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;
