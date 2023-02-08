import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
  }

  main {
    color: ${({ theme }) => theme.colors.black100};
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(133, 133, 133, 0.18);
    border-radius: 12px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.32);
    border-radius: 12px;

  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(133, 133, 133, 0.49);
  }
`;
