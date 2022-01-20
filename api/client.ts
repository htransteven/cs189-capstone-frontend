import { Appointment, Doctor, Patient } from "./models";

export interface APIClient {
  appointments: {
    get: (appointmentId: number) => Promise<Appointment | null>;
    put: (
      appointmentId: number,
      changes: Partial<Appointment>
    ) => Promise<Appointment | null>;
  };
  patients: {
    get: (patientId: string) => Promise<Patient | null>;
  };
  doctors: {
    get: (doctorId: string) => Promise<Doctor | null>;
  };
}

export const createClient = (): APIClient => {
  return {
    appointments: {
      get: async (appointmentId: number) => {
        const res = await fetch(`/api/appointments/${appointmentId}`);
        if (!res.ok) {
          return null;
        }

        const appointment = await res.json();

        return appointment as Appointment;
      },
      put: async (appointmentId: number, changes: Partial<Appointment>) => {
        const res = await fetch(`/api/appointments/${appointmentId}`, {
          method: "PUT",
          body: JSON.stringify(changes),
        });
        if (!res.ok) {
          return null;
        }

        const appointment = await res.json();

        return appointment as Appointment;
      },
    },
    patients: {
      get: async (patientId: string) => {
        const res = await fetch(`/api/patient/${patientId}`);
        if (!res.ok) {
          return null;
        }

        const patient = await res.json();

        return patient as Patient;
      },
    },
    doctors: {
      get: async (doctorId: string) => {
        const res = await fetch(`/api/doctor/${doctorId}`);
        if (!res.ok) {
          return null;
        }

        const doctor = await res.json();

        return doctor as Doctor;
      },
    },
  };
};
