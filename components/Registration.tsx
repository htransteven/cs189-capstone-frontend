import React, { ReactElement } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props {}

const Registration = ({}: Props): ReactElement => {
  const router = useRouter();
  const { user } = useUser();

  const submitRegistration = async () => {
    const { data } = await axios.post(`/api/registration/${user.sub}`, {
      pic: user.picture,
    });

    if (data.message === 'successfully registered') {
      router.push('/api/auth/logout');
    }
  };
  return (
    <div>
      <button
        className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={submitRegistration}
      >
        register
      </button>
    </div>
  );
};

export default Registration;
