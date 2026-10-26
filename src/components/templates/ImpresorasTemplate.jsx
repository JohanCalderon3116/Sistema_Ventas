import styled from "styled-components";
import { Btn1 } from "../moleculas/Btn1";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImpresorasStore } from "../../store/ImpresorasStore";
import { BarLoader } from "react-spinners";
import { Switch } from "../ui/toogles/Switch";
import { SelectList } from "../ui/lists/SelectList";
import { toast, Toaster } from "sonner";
import { useAsignacionCajaSucursalesStore } from "../../store/AsignacionCajaSucursales";
import ticket from "../../reports/TicketPrueba";
import { HeaderImpresoras } from "../organismos/ImpresorasDesing/HeaderImpresoras";

export const ImpresorasTemplate = () => {
  const {
    mostrarDatosPc,
    statePrintDirecto,
    setStatePrintDirecto,
    mostrarListaImpresoras,
    selectImpresora,
    setSelectImpresora,
    editarImpresoras,
    mostrarImpresorasXCaja,
  } = useImpresorasStore();

  const { datSucursalesAsignadas } = useAsignacionCajaSucursalesStore();
  const queryClient = useQueryClient();
  const {
    data: dataPcLocal,
    isLoading: isLoadingDatosPc,
  } = useQuery({
    queryKey: ["mostrar datos de pc"],
    queryFn: mostrarDatosPc,
  });

  const {
    data: dataImpresorasXCaja,
  } = useQuery({
    queryKey: [
      "mostrar impresora por caja",
      {
        id_caja: datSucursalesAsignadas?.id_caja,
      },
    ],
    queryFn: () =>
      mostrarImpresorasXCaja({
        id_caja: datSucursalesAsignadas?.id_caja,
      }),
  });

  const {
    data: dataImpresorasLocales,
  } = useQuery({
    queryKey: ["mostrar impresoras locales"],
    queryFn: mostrarListaImpresoras,
    enabled: !!dataPcLocal,
  });

  const { mutate: doEditar, isPending } = useMutation({
    mutationKey: ["editar impresora"],
    mutationFn: editar,
    onError: (error) => {
      toast.error(`Error en impresora: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Configuración de impresora actualizada");
      queryClient.invalidateQueries(["mostrar impresora por caja"]);
    },
  });

  async function editar() {
    const p = {
      id: dataImpresorasXCaja?.id,
      state: statePrintDirecto,
      pc_name: dataPcLocal?.machineName,
      ip_local: dataPcLocal?.localIPs[0],
      name: selectImpresora?.name,
    };
    await editarImpresoras(p);
  }

  const probarTicket = async () => {
    const response = await ticket("b64");
    const binaryString = atob(response.content);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const file = new File([blob], "GeneratedTicket.pdf", {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("printerName", selectImpresora?.name);
    const responseApi = await fetch("http://localhost:5076/api/print_ticket", {
      method: "POST",
      body: formData,
    });
    if (responseApi.ok) {
      toast.success("El PDF se envió a imprimir correctamente.");
    } else {
      const error = await responseApi.text();
      toast.error("Error al imprimir" + error);
    }
  };

  const descargarArchivo = (ruta) => {
    const link = document.createElement("a");
    link.href = ruta;
    link.target = "blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isloading = isLoadingDatosPc;
  if (isloading) {
    return <BarLoader color="#71717A"></BarLoader>;
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {dataPcLocal ? (
        <SubContainer>
          <HeaderImpresoras></HeaderImpresoras>
          <Title>Impresoras</Title>
          <ContentSwich>
            <SubTitle>Imprimir directo</SubTitle>
            <Switch
              state={statePrintDirecto}
              setState={() => {
                (setStatePrintDirecto(), doEditar());
              }}
            ></Switch>
          </ContentSwich>

          <CardBox>
            {statePrintDirecto ? (
              <>
                <Btn1 titulo="Probar" funcion={probarTicket}></Btn1>
                <SelectList
                  data={dataImpresorasLocales}
                  displayField="name"
                  onSelect={setSelectImpresora}
                  itemSelect={selectImpresora}
                ></SelectList>
                <Btn1
                  titulo="Guardar"
                  bgcolor="#10B981"
                  color="#FFFFFF"
                  funcion={doEditar}
                  disabled={isPending}
                ></Btn1>
              </>
            ) : (
              <span className="anuncio">
                Se mostrará un cuadro de diálogo al momento de imprimir.
              </span>
            )}
          </CardBox>
        </SubContainer>
      ) : (
        <SubContainer>
          <Title>Impresoras</Title>
          <SubTitle>Descargue e instale el servidor</SubTitle>
          <CardBox>
            <Btn1
              titulo="Descargar"
              bgcolor="#121216"
              color="#FFFFFF"
              funcion={() =>
                descargarArchivo(
                  "https://drive.google.com/file/d/1QKSQGn79VVduDoAQF9nb_GM5ZJMci_rx/view?usp=drive_link",
                )
              }
            ></Btn1>
            <span className="nombre">Ver tutorial</span>
          </CardBox>
          <span className="descripcion">
            Servicio para imprimir directo a impresoras térmicas
          </span>
          <section className="advertencia">
            <Icon className="icono" icon="lucide:info" />
            <span>
              Si ya descargó e instaló el ejecutable, actualice esta página.
            </span>
          </section>
        </SubContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 440px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin: auto;
  padding: 24px 16px;
  position: relative;
`;

const ContentSwich = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 10px;
`;

const SubContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  .advertencia {
    background-color: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    gap: 12px;
    color: ${({ theme }) => theme.colorSubtitle};
    width: 100%;
    align-items: center;
    font-size: 13px;
    .icono {
      font-size: 22px;
      flex-shrink: 0;
      color: ${({ theme }) => theme.text};
    }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0 0 8px;
  font-weight: 700;
  text-align: center;
`;

const SubTitle = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colorSubtitle};
`;

const CardBox = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 20px;
  position: relative;
  border-radius: 16px;
  min-height: 180px;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};

  .nombre {
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: ${({ theme }) => theme.colorSubtitle};
  }
  .anuncio {
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;
