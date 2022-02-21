import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React, { useEffect, useState } from 'react';
import { Appointment, Patient } from '../../api-utils/models';
import { useApi } from '../../contexts/APIClientContext';
import { useRole, useUser } from '../../contexts/UserContext';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import Registration from '../../components/Registration';

const PatientProfile = () => {
  const user = useUser();
  const role = useRole();
  const apiClient = useApi();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient>();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [filter, setFilter] = useState<string>('Upcoming');

  useEffect(() => {
    const getPatient = async () => {
      setLoading(true);
      const res = await apiClient.patients.get(user.sub);
      setLoading(false);
      if (!res) {
        alert(`Failed to get patient data for role=${role} and id=${user.sub}`);
        return;
      }
      setPatient(res);
    };
    getPatient();
  }, [apiClient, user.sub, role]);

  return (
    <>
      <Navbar />
      {loading && <div>Loading Patient information</div>}
      {!loading && !patient && <div>Patient not found</div>}
      {!loading && patient && (
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <Registration initialPatient={patient} regType={false} />
          </div>
        </div>
      )}
    </>
  );
};

export default withPageAuthRequired(PatientProfile);
