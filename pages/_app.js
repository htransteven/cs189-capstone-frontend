import 'tailwindcss/tailwind.css';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppWrapper } from '../contexts/AppContext';

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </AppWrapper>
  );
}

export default MyApp;
