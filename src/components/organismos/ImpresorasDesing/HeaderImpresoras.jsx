import styled from "styled-components";
import { useAsignacionCajaSucursalesStore } from "../../../store/AsignacionCajaSucursales";
import { useImpresorasStore } from "../../../store/ImpresorasStore";

export const HeaderImpresoras = () => {
  const { datSucursalesAsignadas } = useAsignacionCajaSucursalesStore();
  const { dataImpresorasXCaja } = useImpresorasStore();
  return (
    <Container>
      <SubContainer>
        <ContainerSucursal>
          <span>Sucursal Asignada: </span>
          <span>Caja Asignada: </span>
        </ContainerSucursal>
        <ContainerCaja>
          <span> {datSucursalesAsignadas?.sucursales.nombre} </span>
          <span>{datSucursalesAsignadas?.caja.descripcion}</span>
        </ContainerCaja>
      </SubContainer>
      <CommandText>PC: {dataImpresorasXCaja?.pc_name}</CommandText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  position: relative;
  border-top: solid 1px ${({ theme }) => theme.bg};
  border-bottom: solid 1px ${({ theme }) => theme.bg};
  margin-bottom: 20px;
`;
const SubContainer = styled.div`
  display: flex;
  gap: 12px;
`;
const ContainerSucursal = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  text-align: end;
  font-weight: bold;
`;
const ContainerCaja = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  text-align: start;
`;
const CommandText = styled.p`
  color: #666;
  font-family: monospace;
  font-size: 14px;
  margin: 0;
`;
