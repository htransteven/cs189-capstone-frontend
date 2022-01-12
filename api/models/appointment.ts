export type Role = "patient" | "doctor";

export interface Comment {
  message: string;
  time: number; // unix timestamp
  author_id: string;
  role: Role;
}

export type AppointmentType = "general_consult";

export interface Appointment {
  id: string;
  type: AppointmentType;
  time: number; // unix timestamp
  doctor_id: string;
  patient_id: string;
  comments: Comment[];
}
