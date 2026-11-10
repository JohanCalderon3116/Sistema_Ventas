import styled, { useTheme } from "styled-components";
import { InputText2 } from "../components/organismos/formularios/InputText2";
import { Btn1 } from "../components/moleculas/Btn1";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useEditarUsuarioMutationStack } from "../tanstack/UsuariosStack";
import { BeatLoader } from "react-spinners";
import { useGlobalStore } from "../store/GlobalStore";
import { ImageSelectorUsuario } from "../hooks/useImageSelectorUsuario";

export const Perfil = () => {
  const { datausuarios } = useUsuariosStore();
  const { mutate, isPending } = useEditarUsuarioMutationStack();
  const theme = useTheme();
  const { fileurl } = useGlobalStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombres: datausuarios?.nombres || "",
      nro_doc: datausuarios?.nro_doc || "",
      telefono: datausuarios?.telefono || "",
    },
  });
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
        <ProfileCard>
          <Title>Mi Perfil</Title>
          <Avatar>
            <ContentRol>
              <span className="dot" />
              <span>{datausuarios?.roles?.nombre}</span>
            </ContentRol>
            <ImageSelectorUsuario
              fileurl={fileurl || datausuarios?.logo}
            ></ImageSelectorUsuario>
            <span className="nombre">{datausuarios?.nombres}</span>
            <span className="sub-email">{datausuarios?.correo}</span>
          </Avatar>
          <form onSubmit={handleSubmit(mutate)}>
            <Label>Nombres</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nombres"
                type="text"
                {...register("nombres", { required: true })}
              />
              {errors.nombres?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Número de Identidad</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nro_doc"
                type="number"
                {...register("nro_doc", { required: true })}
              />
              {errors.nro_doc?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Celular</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="telefono"
                type="number"
                {...register("telefono", { required: true })}
              />
              {errors.telefono?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Email</Label>
            <InputText2>
              <input
                disabled
                defaultValue={datausuarios?.correo}
                className="form__field"
                placeholder="correo"
                type="email"
              />
            </InputText2>
            <div className="submit-wrap">
              <Btn1
                bgcolor="#10B981"
                color="#FFFFFF"
                width="100%"
                titulo="GUARDAR CAMBIOS"
              />
            </div>
          </form>
        </ProfileCard>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 28px 16px;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  p {
    color: #ef4444;
    font-weight: 600;
    font-size: 12px;
    margin: 4px 0 0;
  }
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 20px;
  padding: 26px 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);

  .submit-wrap {
    margin-top: 18px;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 18px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
  position: relative;
  width: 100%;
  border-radius: 16px;
  padding: 24px 16px 18px;
  background-color: ${({ theme }) => theme.bgtotal};
  border: 1px solid ${({ theme }) => theme.color2};

  .nombre {
    font-weight: 700;
    text-align: center;
    font-size: 20px;
    color: ${({ theme }) => theme.text};
    margin-top: 4px;
  }

  .sub-email {
    font-size: 13px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;

const ContentRol = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 999px;
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.text};

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  gap: 8px;
`;

const Label = styled.label`
  display: block;
  margin: 12px 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
