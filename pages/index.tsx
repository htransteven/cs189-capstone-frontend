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
    <div className="flex flex-col p-5 bg-gray-200">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4">
          <p className="font-mono text-3xl">SCRIBE</p>
        </div>
        <div className="col-span-2 justify-self-end">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            {/* eslint-disable-next-line */}
            <a href="/api/auth/logout">Logout</a>
          </button>
        </div>
      </div>
      {role == 'Patient' && <PatientHome />}
      {role == 'Provider' && <ProviderHome />}
      {role == 'None' && <div>Please contact admin to give you a role</div>}
    </div>
  );
}
