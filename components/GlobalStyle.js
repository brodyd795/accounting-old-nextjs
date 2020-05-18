import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html, body, #__next {
        background-color: gray;
        height: 100%;
        margin: 0;
        padding: 0;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
    }
`;

export default GlobalStyle;
