import "tailwindcss/tailwind.css";
import { UserProvider as AuthProvider } from "@auth0/nextjs-auth0";
import { UserProvider } from "../contexts/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;
