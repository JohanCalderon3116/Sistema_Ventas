import { createGlobalStyle } from "styled-components";
export const GlobalStyles = createGlobalStyle`
    body{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Poppins", sans-serif;
        background-color:  ${(props) => props.theme.bgtotal};
        color: white;
    }
`;
