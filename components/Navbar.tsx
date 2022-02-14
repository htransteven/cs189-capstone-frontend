import { useUser } from "../contexts/UserContext";

const Navbar = () => {
  const user = useUser();
  return (
    <div>
      <header className='px-5 border-b'>
        <div className='grid grid-cols-6 gap-4 py-4'>
          <h1 className='font-mono text-3xl font-bold text-gray-900'>SCRIBE</h1>
        </div>
      </header>
      <header className='px-5 border-b'>
        <div className='grid grid-cols-6 gap-4 py-4'>
          <div className='col-span-4'>
            <p className='text-md'>Hello, {user.name}</p>
          </div>
          <div className='col-span-2 justify-self-end'>
            <button
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
            >
              {/* eslint-disable-next-line */}
              <a href='/api/auth/logout'>Logout</a>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
