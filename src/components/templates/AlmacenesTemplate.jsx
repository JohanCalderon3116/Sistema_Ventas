import styled, { keyframes } from "styled-components";
import {
  ListAlmacenes,
  RegistrarAlmacen,
  RegistrarSucursal,
  useAlmacenesStore,
  useSucursalesStore,
} from "../../index";
import { Toaster } from "sonner";
import { AnimatedGrid } from "../ui/animated/AnimatedGrid";

const aparecer = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AlmacenesTemplate = () => {
  const { stateSucursal } = useSucursalesStore();
  const { stateAlmacen } = useAlmacenesStore();
  return (
    <Container>
      <Toaster richColors position="top-center"></Toaster>
      {stateSucursal && <RegistrarSucursal></RegistrarSucursal>}
      {stateAlmacen && <RegistrarAlmacen></RegistrarAlmacen>}
      <section className="area1">
        <Header>
          <Title>Almacenes por sucursal</Title>
          <Subtitle>Gestiona tus almacenes por sucursal</Subtitle>
        </Header>
      </section>
      <section className="area2">
        <ListAlmacenes></ListAlmacenes>
      </section>
      <AnimatedGrid></AnimatedGrid>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: grid;
  position: relative;
  grid-template:
    "area1" 300px
    "area2" auto;
  overflow: auto;
  animation: ${aparecer} 0.3s ease both;
  .area1 {
    grid-area: area1;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
  }
  .area2 {
    grid-area: area2;
    position: relative;
    z-index: 2;
    padding-bottom: 20px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colorSubtitle};
  margin: 5px 0 0;
`;
