import React, { useEffect, useState } from "react";
import { AppointmentCard } from "..";
import { Appointment } from "../../api/models";
import { useApi } from "../../contexts/APIClientContext";
import { useRole, useUser } from "../../contexts/UserContext";

export const PatientHome = () => {
  const user = useUser();
  const role = useRole();
  const apiClient = useApi();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    const getAppointments = async () => {
      setLoading(true);
      const res = await apiClient.appointments.getAll(user.sub, role);
      setLoading(false);
      if (!res) {
        alert(
          `Failed to get all appointments for role=${role} and id=${user.sub}`
        );
        return;
      }

      setAppointments(res);
    };
    getAppointments();
  }, [apiClient, user.sub, role]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap -mx-4">
        {loading && "Loading appointments..."}
        {!loading && !appointments && "No appointment data found"}
        {appointments &&
          appointments.map((appointment) => (
            <AppointmentCard
              key={`appointment-${appointment.appointment_id}`}
              {...appointment}
            />
          ))}
      </div>
    </div>
  );
};
