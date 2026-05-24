import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useCajasStore,
  SelectList,
  useEmpresaStore,
  useSucursalesStore,
  Spinner1,
  PermisosUser,
  useUsuariosStore,
  useRolesStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { Icon } from "@iconify/react";
import { BarLoader } from "react-spinners";
export function RegistrarUsuarios({ accion, dataSelect, onClose }) {
  const queryClient = useQueryClient();
  const {
    cajaSelelctItem,
    setStateCaja,
    insertarCaja,
    editarCaja,
    mostrarCajaXSucursal,
    setCajaSelelctItem,
  } = useCajasStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarSucursales, sucursalesItemSelect, selectSucursal } =
    useSucursalesStore();
  const { insertarUsuarios } = useUsuariosStore();
  const { rolesItemSelect } = useRolesStore();
  const { data: dataSucursales, isLoading: isLoadingSucursales } = useQuery({
    queryKey: [
      "mostrar sucursales",
      {
        id_empresa: dataempresa?.id,
      },
    ],
    queryFn: () =>
      mostrarSucursales({
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });

  const { data: dataCaja, isLoading: isLoadingSCaja } = useQuery({
    queryKey: [
      "mostrar caja por sucursal",
      {
        id_sucursal: sucursalesItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarCajaXSucursal({
        id_sucursal: sucursalesItemSelect?.id,
      }),
    enabled: !!sucursalesItemSelect,
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const insertar = async (data) => {
    const p = {
      id: accion === "Editar" ? dataSelect?.id : null,
      nombres: data.nombres,
      nro_doc: data.nro_doc,
      telefono: data.telefono,
      id_rol: rolesItemSelect?.id,
      correo: data.email,
      // datos asignacion caja y sucursal
      id_sucursal: sucursalesItemSelect?.id,
      id_caja: cajaSelelctItem?.id,
      //datos credenciales
      email: data.email,
      pass: data.pass,
    };
    if (accion === "Editar") {
    } else {
      await insertarUsuarios(p);
    }
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar usuarios"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Usuario registrado correctamenete");
      queryClient.invalidateQueries(["mostrar usuarios asignados"]);
      onClose();
    },
  });

  const manejadorInsertar = (data) => {
    doInsertar(data);
  };
  const isLoading = isLoadingSucursales || isLoadingSCaja;
  if (isLoading) {
    return <BarLoader color="#6d6d6d"></BarLoader>;
  }
  return (
    <Container>
      {isPending ? (
        <span>Guardando</span>
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
                  icono={<Icon icon="line-md:account-add" height="30"></Icon>}
                >
                  <input
                    className="form__field"
                    defaultValue={accion === "Editar" ? dataSelect?.correo : ""}
                    type="text"
                    placeholder="Correo"
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
                    <Icon icon="fluent:password-16-filled" height="30"></Icon>
                  }
                >
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.password : ""
                    }
                    type="password"
                    placeholder="Contraseña"
                    {...register("pass", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Contraseña</label>
                  {errors.pass?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText
                  icono={
                    <Icon icon="icon-park-outline:edit-name" height="30"></Icon>
                  }
                >
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.nombres : ""
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
                <InputText icono={<Icon icon="tabler:id" height="30"></Icon>}>
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.nro_doc : ""
                    }
                    type="text"
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
                  icono={<Icon icon="ic:baseline-phone" height="30"></Icon>}
                >
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? dataSelect?.telefono : ""
                    }
                    type="text"
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
              <Btn1 titulo="Guardar" color="#fff" bgcolor="#2c2ca8"></Btn1>
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
  backdrop-filter: blur(5px);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: ${({ theme }) => theme.body};
  padding: 20px;
  border-radius: 8px;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
  width: 100%;
  margin: 10px;
  border: 1px solid ${({ theme }) => theme.bg};
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
  font-size: 30px;
  font-weight: bold;
`;
