import React, { ReactElement, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { useApi } from '../contexts/APIClientContext';
import { Patient } from '../api/models';

interface Props {}

const Registration = ({}: Props): ReactElement => {
  const router = useRouter();
  const apiClient = useApi();
  const { user } = useUser();
  const initialPatient: Patient = {
    patient_id: user.sub,
    first_name: user.name,
    last_name: user.name,
    birthday: -1,
    sex: 'N/A',
    active_medications: [],
    preexisting_conditions: [],
    primary_doctor_id: '61a92e6e9d9996006a5b3b35',
  };

  const [patient, setPatient] = useState<Patient>(initialPatient);

  const submitRegistration = async () => {
    const res = await apiClient.patients.post(patient, user.picture);

    if (res) {
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
