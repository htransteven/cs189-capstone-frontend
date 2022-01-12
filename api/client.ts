import { Appointment } from "./models";

export interface APIClient {
  appointments: {
    get: (appointmentId: string | number) => Promise<Appointment | null>;
    put: (appointmentId: string | number) => Promise<Appointment | null>;
    delete: (appointmentId: string | number) => Promise<Appointment | null>;
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
  };
};
