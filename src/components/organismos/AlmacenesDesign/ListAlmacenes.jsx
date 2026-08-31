import styled, { useTheme } from "styled-components";
import { useSucursalesStore } from "../../../store/SucursalesStore";
import { BeatLoader } from "react-spinners";
import { Icon } from "@iconify/react";
import { Device } from "../../../styles/breakpoints";
import { ButtonDashed } from "../../ui/buttons/ButtonDashed";
import { useAlmacenesStore } from "../../../store/AlmacenesStore";
import { formatearFechaColombia } from "../../../hooks/useFormattedDate";
import {
  useEliminarAlmacenesMutationStack,
  useMostrarAlmacenesXEmpresaQueryStack,
} from "../../../tanstack/AlmacenesStack";
import { useEliminarSucursalesMutationStack } from "../../../tanstack/SucursalesStack";

export const ListAlmacenes = () => {
  const theme = useTheme();
  const {
    setStateAlmacen,
    setAlmacenSelelctItem,
    setAccion: setAccionAlmacen,
  } = useAlmacenesStore();
  const { setStateSucursal, setAccion, selectSucursal, eliminarSucursal } =
    useSucursalesStore();
  const { isLoading, error, data } = useMostrarAlmacenesXEmpresaQueryStack();
  const editarSucursal = (p) => {
    selectSucursal(p);
    setStateSucursal(true);
    setAccion("Editar");
  };
  const agregarAlmacen = (p) => {
    setAccionAlmacen("Nuevo");
    setStateAlmacen(true);
    setAlmacenSelelctItem(p);
  };
  const editarAlmacen = (p) => {
    setStateAlmacen(true);
    setAccionAlmacen("Editar");
    setAlmacenSelelctItem(p);
  };
  const { mutate: doDeleteSucursal } = useEliminarSucursalesMutationStack();
  const { mutate: doDeleteAlamcenes } = useEliminarAlmacenesMutationStack();
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }
  if (error) {
    <span>Error: {error.message} </span>;
  }
  return (
    <Container>
      {data?.map((sucursal, index) => {
        return (
          <Sucursal key={index}>
            <SucursalHeader>
              <Acciones $right="0px" $top="0px">
                {sucursal?.delete && (
                  <Icon
                    icon="wpf:delete"
                    width="15"
                    height="15"
                    className="deleteicon"
                    onClick={() => doDeleteSucursal(sucursal?.id)}
                  />
                )}
                <Icon
                  icon="mdi:edit"
                  width="20"
                  height="20"
                  onClick={() => editarSucursal(sucursal)}
                />
              </Acciones>
              <SucursalTitle>Sucursal: {sucursal.nombre}</SucursalTitle>
            </SucursalHeader>
            <CajaList>
              {sucursal.almacenes?.map((almacenes, index) => {
                return (
                  <CajaItem key={index}>
                    <CajaInfo>
                      <FechaCreacion>
                        {formatearFechaColombia(almacenes.fecha_creacion_a)}
                      </FechaCreacion>
                    </CajaInfo>
                    <CajaDescripcion> {almacenes.nombre} </CajaDescripcion>
                    <Acciones $right="10px" $bottom="10px">
                      {almacenes?.delete && (
                        <Icon
                          icon="wpf:delete"
                          width="15"
                          height="15"
                          className="deleteicon"
                          onClick={() => doDeleteAlamcenes(almacenes?.id)}
                        />
                      )}
                      <Icon
                        icon="mdi:edit"
                        width="20"
                        height="20"
                        onClick={() => editarAlmacen(almacenes)}
                      />
                    </Acciones>
                  </CajaItem>
                );
              })}
            </CajaList>
            <ButtonDashed
              funcion={() => agregarAlmacen(sucursal)}
              title="Agregar almacen"
            ></ButtonDashed>
          </Sucursal>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  column-count: 1;
  column-gap: 20px;
  width: 90%;
  max-width: 1200px;
  margin: auto;
  @media ${Device.tablet} {
    column-count: 2;
  }
  @media ${Device.desktop} {
    column-count: 3;
  }
`;
const Acciones = styled.section`
  position: absolute;
  right: ${(props) => props.$right};
  top: ${(props) => props.$top};
  bottom: ${(props) => props.$bottom};
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  .deleteicon {
    &:hover {
      color: #c22929 !important;
    }
  }
`;
const Sucursal = styled.div`
  background-color: ${({ theme }) => theme.body};
  border: 2px solid ${({ theme }) => theme.colortitlecard};
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  break-inside: avoid;
  margin-bottom: 20px;
  position: relative;
`;
const SucursalHeader = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;
const SucursalTitle = styled.h3`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  position: relative;
  top: 10px;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;
const CajaList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const CajaItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 2px solid ${({ theme }) => theme.bg};
  padding: 10px;
  border-radius: 8px;
  justify-content: space-between;
  position: relative;
`;
const CajaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FechaCreacion = styled.span`
  font-size: 14px;
  color: #9ca3af;
  text-align: start;
`;
const CajaDescripcion = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  text-align: center;
`;
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;
