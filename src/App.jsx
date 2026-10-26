import { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  Dark,
  GlobalStyles,
  Light,
  Myroutes,
  useUsuariosStore,
} from "./index";
import { useThemeStore } from "./store/ThemeStore";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { LimpiezaVentas } from "./hooks/LimpiezaVentas";
import { AuthGate } from "./hooks/AuthGate";

function App() {
  const { setTheme, themeStyle } = useThemeStore();
  const { datausuarios } = useUsuariosStore();

  useEffect(() => {
    if (datausuarios?.tema) {
      const themeStyle = datausuarios.tema === "light" ? Light : Dark;
      setTheme({
        tema: datausuarios.tema,
        style: themeStyle,
      });
    }
  }, [datausuarios?.tema, setTheme]);

  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles></GlobalStyles>
        <LimpiezaVentas />
        <AuthGate>
          <Myroutes></Myroutes>
        </AuthGate>
        <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
