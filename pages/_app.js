import "tailwindcss/tailwind.css";
import { UserProvider as AuthProvider } from "@auth0/nextjs-auth0";
import { UserProvider } from "../contexts/UserContext";
import AuthWrapper from "../components/AuthWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;
