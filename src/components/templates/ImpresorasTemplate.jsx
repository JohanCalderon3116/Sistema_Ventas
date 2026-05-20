import styled from "styled-components";
import { Btn1 } from "../moleculas/Btn1";
import { slideBackground } from "../../styles/Keyframes";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImpresorasStore } from "../../store/ImpresorasStore";
import { BarLoader } from "react-spinners";
import { Switch } from "../ui/toogles/Switch";
import { SelectList } from "../ui/lists/SelectList";
import { toast, Toaster } from "sonner";
import { useAsignacionCajaSucursalesStore } from "../../store/AsignacionCajaSucursales";
import { useState } from "react";
import ticket from "../../reports/TicketPrueba";
export const ImpresorasTemplate = () => {
  const [selectedFile, setselectedFile] = useState(null);
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
    error: errorDatosPc,
  } = useQuery({
    queryKey: ["mostrar datos de pc"],
    queryFn: mostrarDatosPc,
  });

  const {
    data: dataImpresorasXCaja,
    isLoading: isLoadingImpresoraXCaja,
    error: errorImpresoraXCaja,
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
    isLoading: isLoadingImpresorasLocales,
    error: errorImpresorasLocales,
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
      toast.success("Todo salio bien :3");
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
    // Convertir el contenido base64 en un archivo Blob
    const binaryString = atob(response.content);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    // Crear un archivo simulando un archivo subido
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
  const error = errorDatosPc;
  if (isloading) {
    return <BarLoader color="#b7b7b7"></BarLoader>;
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {dataPcLocal ? (
        <SubContainer>
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

          <Avatar $bg="#9d0ec5">
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
                  funcion={doEditar}
                  disabled={isPending}
                ></Btn1>
              </>
            ) : (
              <span className="anuncio">
                Se mostrara un cudro de dialogo al momento de imprimit
              </span>
            )}
          </Avatar>
        </SubContainer>
      ) : (
        <SubContainer>
          <Title>Impresoras</Title>
          <SubTitle>Descargue e instale el servidor</SubTitle>
          <Avatar $bg="#9d0ec5">
            <Btn1
              titulo="Descargar"
              funcion={() =>
                descargarArchivo(
                  "https://drive.google.com/file/d/1QKSQGn79VVduDoAQF9nb_GM5ZJMci_rx/view?usp=drive_link",
                )
              }
            ></Btn1>
            <span className="nombre"> Ver tutorial</span>
          </Avatar>
          <span className="descripcion">
            {" "}
            Servicio para imprimir directo a impresoras termicas
          </span>
          <br />
          <section className="advertencia">
            <Icon className="icono" icon="meteocons:barometer" />
            <span>
              Si ya descargo e instalo el ejecutable, actualice esta pagina :p
            </span>
          </section>
        </SubContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  margin: auto;
  position: relative;
`;
const ContentSwich = styled.section`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
`;
const SubContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .advertencia {
    background-color: rgba(237, 95, 6, 0.2);
    border-radius: 10px;
    margin-top: 10px;
    margin: auto;
    height: 70px;
    display: flex;
    color: #f75510;
    width: 100%;
    align-items: center;
    .icono {
      font-size: 100px;
    }
  }
`;
const Title = styled.span`
  font-size: 44px;
  margin-bottom: 20px;
  font-weight: bold;
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  text-align: center;
`;
const SubTitle = styled.span`
  font-size: 20px;
`;
const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  border-radius: 10px;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  .nombre {
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
  }
  .anuncio {
    text-align: center;
    font-weight: bold;
    color: #fff;
  }
  background-color: ${(props) => props.$bg};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='0.19' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");

  background-size: 60px 60px;
  animation: ${slideBackground} 10s linear infinite;
`;
