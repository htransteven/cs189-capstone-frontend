import "tailwindcss/tailwind.css";
import { UserProvider as AuthProvider } from "@auth0/nextjs-auth0";
import { UserProvider } from "../contexts/UserContext";
import { ApiProvider } from "../contexts/APIClientContext";
import AuthWrapper from "../components/AuthWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <AuthWrapper>
          <ApiProvider>
            <Component {...pageProps} />
          </ApiProvider>
        </AuthWrapper>
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;
