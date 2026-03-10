import styled, { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  GlobalStyles,
  Myroutes,
  Sidebar,
  Login,
} from "./index";
import { Device } from "./styles/breakpoints";
import { useThemeStore } from "./store/ThemeStore";
import { useState } from "react";
import { useLocation } from "react-router-dom";
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
            <section className="contentMenuambur"></section>
            <section className="contentRouters ">
              <Myroutes></Myroutes>
            </section>
          </Container>
        ) : (
          <Login></Login>
        )}
      </AuthContextProvider>
    </ThemeProvider>
  );
}
const Container = styled.main`
  transition: 0.1s all ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
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
