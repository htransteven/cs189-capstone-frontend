import "tailwindcss/tailwind.css";
import React from "react";

export const Login = () => {
  return (
    <div className='flex flex-col mt-5'>
      <div className='md:flex md:justify-center m-2'>
        <p className='text-5xl'>Welcome to BRAD</p>
      </div>
      <div className='md:flex md:justify-center m-2'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded '>
          {/* eslint-disable-next-line */}
          <a href='/api/auth/login'>Login</a>
        </button>
      </div>
    </div>
  );
};
