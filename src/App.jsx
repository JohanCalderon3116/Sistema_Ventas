import styled, { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  Dark,
  GlobalStyles,
  Light,
  Myroutes,
  useUsuariosStore,
} from "./index";
import { useThemeStore } from "./store/ThemeStore";
import { useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
function App() {
  const { setTheme, themeStyle, theme } = useThemeStore();
  const { datausuarios } = useUsuariosStore();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/login") {
      setTheme({
        tema: "light",
        style: Light,
      });
    } else {
      if (datausuarios) {
        const themeStyle = datausuarios?.tema === "light" ? Light : Dark;
        setTheme({
          tema: datausuarios?.tema,
          style: themeStyle,
        });
      }
    }
  }, [datausuarios]);
  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles></GlobalStyles>
        <Myroutes></Myroutes>
        <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
