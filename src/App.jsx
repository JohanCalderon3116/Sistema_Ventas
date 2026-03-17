import styled, { ThemeProvider } from "styled-components";
import { AuthContextProvider, GlobalStyles, Myroutes } from "./index";
import { useThemeStore } from "./store/ThemeStore";
import { useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function App() {
  const { themeStyle } = useThemeStore();
  const { pathname } = useLocation();
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
