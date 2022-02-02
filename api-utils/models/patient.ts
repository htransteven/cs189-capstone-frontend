export interface Condition {
  id: string;
  name: string;
}

export interface Medication {
  name: string; // ex. Insulin
  dosage: string; // ex. 30mg
  timesPerWeek: number; // ex. 5
}

export interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: number; // unix timestamp
  sex: string;
  active_medications: Medication[];
  preexisting_conditions: Condition[];
  primary_doctor_id: string;
}
