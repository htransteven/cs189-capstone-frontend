import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useApi } from "../../../contexts/APIClientContext";
import { Appointment } from "../../../api/models";

const AppointmentPage = () => {
  const router = useRouter();
  const { appointmentId } = router.query;
  const apiClient = useApi();
  const [appointment, setAppointment] = useState<Appointment>(null);
  console.log(appointmentId);

  useEffect(() => {
    const getAppointment = async () => {
      const appt = await apiClient.appointments.get(appointmentId as string);
      if (!appt) {
        alert("no appointment found!");
        return;
      }

      setAppointment(appt);
    };

    getAppointment();
  }, [apiClient.appointments, appointmentId]);

  if (!appointment) return null;
  return (
    <div>
      {Object.keys(appointment).map((key) => (
        <div key={key}>
          {key}: {appointment[key]}
        </div>
      ))}
    </div>
  );
};

export default AppointmentPage;
