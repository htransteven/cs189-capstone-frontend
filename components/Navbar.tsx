import { useUser } from "../contexts/UserContext";

const Navbar = () => {
  const user = useUser();
  return (
    <div className="min-h-full">
      <header className="px-5 border-b">
        <div className="grid grid-cols-6 gap-4 py-4">
          <h1 className="font-mono text-3xl font-bold text-gray-900">SCRIBE</h1>
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
    </div>
  );
};

export default Navbar;
