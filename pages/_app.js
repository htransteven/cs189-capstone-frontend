import "tailwindcss/tailwind.css";
import { UserProvider as AuthProvider } from "@auth0/nextjs-auth0";
import { UserProvider } from "../contexts/UserContext";
import { ApiProvider } from "../contexts/APIClientContext";
import AuthWrapper from "../components/AuthWrapper";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html{
  box-sizing: border-box;
  margin:0;
  padding: 0;
}

body{
  margin:0;
  padding: 0;
  font-size: 14px;
}
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <UserProvider>
          <AuthWrapper>
            <ApiProvider>
              <Component {...pageProps} />
            </ApiProvider>
          </AuthWrapper>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
