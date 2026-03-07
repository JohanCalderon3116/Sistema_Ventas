import styled from "styled-components";
import { GlobalStyles } from "./index";
import { Device } from "./styles/breakpoints";
function App() {
  return (
    <Container>
      <GlobalStyles></GlobalStyles>
      <section className="contentSidebar">sidebar</section>
      <section className="contentMenuambur">menuambur</section>
      <section className="contentRouters ">roters</section>
    </Container>
  );
}
const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  background-color: black;
  .contentSidebar {
    display: none;
    background-color: black;
  }
  .contentMenuambur {
    position: absolute;
    background-color: black;
  }
  .contentRouters {
    grid-column: 1;
    width: 100%;
    background-color: black;
  }
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
    .contentSidebar {
      display: initial;
    }
    .contentMenuambur {
      display: none;
    }
    .contentRouters{
      grid-column: 2;
    }
  }
`;
export default App;
