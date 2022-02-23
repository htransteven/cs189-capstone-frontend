import { Appointment, ChatLogs, Doctor, Patient, Role } from "./models";
import axios from "axios";

export interface APIClient {
  appointments: {
    get: (appointmentId: number) => Promise<Appointment | null>;
    put: (
      appointmentId: number,
      changes: Partial<Appointment>
    ) => Promise<Appointment | null>;
    getAll: (id: string, role: Role) => Promise<Appointment[] | null>;
    getChatLogs: (appointmentId: number) => Promise<ChatLogs[] | null>;
  };
  patients: {
    get: (patientId: string) => Promise<Patient | null>;
    post: (
      patient: Patient,
      picture: string,
      regType: boolean
    ) => Promise<Patient | null>;
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
      getChatLogs: async (appointmentId: number) => {
        const res = await fetch(`/api/appointments/${appointmentId}/chatlogs`);
        if (!res.ok) {
          return null;
        }

        const logs = await res.json();

        return logs as ChatLogs[];
      },
      getAll: async (id: string, role: Role) => {
        const res = await fetch(`/api/${role}/${id}/appointments`);
        if (!res.ok) {
          return null;
        }

        const appointments = await res.json();

        return appointments as Appointment[];
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
      post: async (patient: Patient, picture: string, regType: boolean) => {
        if (regType) {
          const res = await axios.post(
            `/api/registration/${patient.patient_id}`,
            {
              picture,
            }
          );

          if (res.statusText !== "Created") {
            return null;
          }
          if (res.data.message === "successfully registered") {
            const res = await axios.post("/api/patient", patient);

            if (res.statusText !== "OK") {
              return null;
            }

            return (await res.data) as Patient;
          }
        } else {
          const res = await axios.post("/api/patient", patient);

          if (res.statusText !== "OK") {
            return null;
          }

          return (await res.data) as Patient;
        }

        return null;
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
