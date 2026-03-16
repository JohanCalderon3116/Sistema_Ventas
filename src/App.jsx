import styled, { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  GlobalStyles,
  Myroutes,
  Sidebar,
  Login,
  Toogle,
} from "./index";
import { Device } from "./styles/breakpoints";
import { useThemeStore } from "./store/ThemeStore";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; 
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themeStyle } = useThemeStore();
  const { pathname } = useLocation();
  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles></GlobalStyles>
        {pathname != "/login" ? (
          <Container className={sidebarOpen ? "active" : ""}>
            <section className="contentSidebar">
              <Sidebar
                state={sidebarOpen}
                setState={() => setSidebarOpen(!sidebarOpen)}
              ></Sidebar>
            </section>
            <section className="contentMenuambur"><Toogle></Toogle></section>
            <section className="contentRouters ">
              <Myroutes></Myroutes>
            </section>
          </Container>
        ) : (
          <Login></Login>
        )}
        <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  transition: 0.1s ease-in-out;
  color: ${({ theme }) => theme.text};

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
