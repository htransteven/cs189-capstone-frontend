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
    setRole: (patient: Patient, picture: string) => Promise<boolean>;
    post: (patient: Patient) => Promise<Patient | null>;
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
      setRole: async (patient: Patient, picture: string) => {
        // patient is our model
        // patient_id does not have google-auth| or auth0|
        const oAuthUserId = `${
          picture.includes("google") ? "google-oauth2" : "auth0"
        }|${patient.patient_id}`;
        const res = await axios.post(`/api/registration/${oAuthUserId}`);

        return res.status === 201;
      },
      post: async (patient: Patient) => {
        // patient is our model
        // patient_id does not have google-auth| or auth0|
        const resPatient = await axios.post("/api/patient", patient);

        if (resPatient.status !== 200) {
          return null;
        }

        return resPatient.data as Patient;
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
