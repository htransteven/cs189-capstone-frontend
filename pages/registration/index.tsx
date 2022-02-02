import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Registration from '../../components/Registration';
import { useRole } from '../../contexts/UserContext';

const RegistrationPage = (): ReactElement => {
  const role = useRole();
  const router = useRouter();

  useEffect(() => {
    if (role === 'doctor') {
      router.push('/doctor');
    }
    if (role === 'patient') {
      router.push('/patient');
    }
  }, [role, router]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <Registration />
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(RegistrationPage);
