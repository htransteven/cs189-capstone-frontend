import { useUser } from '@auth0/nextjs-auth0';
import 'tailwindcss/tailwind.css';
import { Login, ChatBot, PatientHome, ProviderHome } from '../components';

const whatRole = (role) => {
  const roleURL = 'https://myapp/role';
  if (!role.includes(roleURL)) {
    return 'None';
  }

  if (role.includes('Patient')) {
    return 'Patient';
  }

  if (role.includes('Provider')) {
    return 'Provider';
  }

  return 'None';
};
export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Login />;
  }

  const roleStr = JSON.stringify(user).split(',')[0];
  const role = whatRole(roleStr);
  return (
    <div className="min-h-full">
      <header className="px-5 border-b">
        <div className="grid grid-cols-6 gap-4 py-4">
          <h1 className="font-mono text-3xl font-bold text-gray-900">SRIBE</h1>
        </div>
      </header>
      <header className="px-5 border-b">
        <div className="grid grid-cols-6 gap-4 py-4">
          <div className="col-span-4">
            <p className="text-md">Hello, {user.name}</p>
          </div>
          <div className="col-span-2 justify-self-end">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              {/* eslint-disable-next-line */}
              <a href="/api/auth/logout">Logout</a>
            </button>
          </div>
        </div>
      </header>
      <body className="antialiased bg-gray-200 p-6 h-screen">
        {role == 'Patient' && <PatientHome />}
        {role == 'Provider' && <ProviderHome />}
        {role == 'None' && <div>Please contact admin to give you a role</div>}
      </body>
    </div>
  );
}
