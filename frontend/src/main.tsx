import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Global, css } from "@emotion/react";
import App from "./App.tsx";
import { theme } from "./styles/theme.ts";

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.typography.fontFamily};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }
`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Global styles={globalStyles} />
    <App />
  </StrictMode>
);
