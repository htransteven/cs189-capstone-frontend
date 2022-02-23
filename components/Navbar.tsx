import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRole, useUser } from '../contexts/UserContext';

const Navbar = () => {
  const user = useUser();
  const role = useRole();
  const router = useRouter();

  return (
    <div>
      <header
        className=" top-0 z-10 pt-12 pb-10 backdrop-filter backdrop-blur-xl backdrop-brightness-50
                   dark:bg-primary dark:text-white"
      >
        <nav
          id="header"
          className="fixed mt-5 w-full z-30 top-0 text-white after:bg-white"
        >
          <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0">
            <div className="pl-4 flex items-center">
              {/* <!--Icon from: http://www.potlabicons.com/ --> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 inline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <Link href="/">
                <a className='className="toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"'>
                  B.R.A.D
                </a>
              </Link>
            </div>
            <div className="block lg:hidden pr-4">
              <button
                id="nav-toggle"
                className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                <svg
                  className="fill-current h-6 w-6"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </div>
            <div
              className="w-full flex-grow justify-end lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
              id="nav-content"
            >
              <p className="text-md text-white">Hello, {user.name}</p>
              {role === 'patient' && (
                <Link href="/patient/profile">
                  <a className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    {' '}
                    Profile{' '}
                  </a>
                </Link>
              )}

              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {/* eslint-disable-next-line */}
                <a href="/api/auth/logout">Logout</a>
              </button>
            </div>
            <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
