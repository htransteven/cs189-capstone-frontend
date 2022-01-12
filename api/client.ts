import { Appointment, Patient } from "./models";

export interface APIClient {
  appointments: {
    get: (appointmentId: string | number) => Promise<Appointment | null>;
    put: (appointmentId: string | number) => Promise<Appointment | null>;
    delete: (appointmentId: string | number) => Promise<Appointment | null>;
  };
  patients: {
    get: (patientId: string | number) => Promise<Patient | null>;
    put: (patientId: string | number) => Promise<Patient | null>;
    delete: (patientId: string | number) => Promise<Patient | null>;
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
      put: async (appointmentId: number) => {
        const res = await fetch(`/api/appointments/${appointmentId}`);
        if (!res.ok) {
          return null;
        }

        const appointment = await res.json();

        return appointment as Appointment;
      },
      delete: async (appointmentId: number) => {
        const res = await fetch(`/api/appointments/${appointmentId}`);
        if (!res.ok) {
          return null;
        }

        const appointment = await res.json();

        return appointment as Appointment;
      },
    },
    patients: {
      get: async (patientId: number) => {
        const res = await fetch(`/api/patient/${patientId}`);
        if (!res.ok) {
          return null;
        }

        const patient = await res.json();

        return patient as Patient;
      },
      put: async (patientId: number) => {
        const res = await fetch(`/api/patient/${patientId}`);
        if (!res.ok) {
          return null;
        }

        const patient = await res.json();

        return patient as Patient;
      },
      delete: async (patientId: number) => {
        const res = await fetch(`/api/patient/${patientId}`);
        if (!res.ok) {
          return null;
        }

        const patient = await res.json();

        return patient as Patient;
      },
    },
  };
};
