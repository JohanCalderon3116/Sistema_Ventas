import styled, { ThemeProvider } from "styled-components";
import { GlobalStyles, Myroutes, Sidebar } from "./index";
import { Device } from "./styles/breakpoints";
import { useThemeStore } from "./store/ThemeStore";
import { useState } from "react";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themeStyle } = useThemeStore();
  return (
    <ThemeProvider theme={themeStyle}>
      <Container className={sidebarOpen ? "active" : ""}>
        <GlobalStyles></GlobalStyles>
        <section className="contentSidebar">
          <Sidebar
            state={sidebarOpen}
            setState={() => setSidebarOpen(!sidebarOpen)}
          ></Sidebar>
        </section>
        <section className="contentMenuambur"></section>
        <section className="contentRouters ">
          <Myroutes></Myroutes>
        </section>
      </Container>
    </ThemeProvider>
  );
}
const Container = styled.main`
  transition: 0.1s all ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  color: ${({theme}) => theme.text};

  .contentSidebar {
    display: none;
  }
  .contentMenuambur {
    position: absolute;
  }
  .contentRouters {
    grid-column: 1;
    width: 100%;
  }
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
    &.active {
      grid-template-columns: 260px 1fr;
    }
    .contentSidebar {
      display: initial;
    }
    .contentMenuambur {
      display: none;
    }
    .contentRouters {
      grid-column: 2;
    }
  }
`;
export default App;
