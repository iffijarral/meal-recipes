import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "./App.js";
import theme from "./theme.js";
import ApolloWrapper from "./apolloClient.js";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ApolloWrapper>
        <App />
      </ApolloWrapper>
    </ChakraProvider>
  </React.StrictMode>
);
