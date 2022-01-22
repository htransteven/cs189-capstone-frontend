import { Role } from "./misc";

export interface Symptom {
  id: string;
  label: string;
}

export interface Comment {
  message: string;
  time: number; // unix timestamp
  author_id: string;
  role: Role;
}

export type AppointmentType = "general_consult";

export interface Appointment {
  appointment_id: number;
  appointment_type: AppointmentType;
  appointment_time: number; // unix timestamp
  doctor_id: string;
  patient_id: string;
  comments: Comment[];
  symptoms: Symptom[];
  initial_diagnosis: string[];
  doctor_diagnosis: string;
}
