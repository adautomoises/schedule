import { ThemeProvider } from "styled-components";
import Router from "./routes";

import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";

import { AuthProvider } from "./context/userContext";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthProvider>
        <Router />
      </AuthProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
