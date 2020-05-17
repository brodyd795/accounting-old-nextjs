import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html, body, #__next {
        background-color: white;
        height: 100%;
        margin: 0;
        padding: 0;
    }
`;

export default GlobalStyle;
