import "tailwindcss/tailwind.css";
import { UserProvider as AuthProvider } from "@auth0/nextjs-auth0";
import { UserProvider } from "../contexts/UserContext";
import { ApiProvider } from "../contexts/APIClientContext";
import { createGlobalStyle } from "styled-components";
import { pallete } from "../styles";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";

const GlobalStyle = createGlobalStyle`
html{
  box-sizing: border-box;
  margin:0;
  padding: 0;
}

body{
  margin:0;
  padding: 0;
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  background-color: ${pallete.offwhite};
}
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <UserProvider>
          <ApiProvider>
            <Component {...pageProps} />
          </ApiProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
