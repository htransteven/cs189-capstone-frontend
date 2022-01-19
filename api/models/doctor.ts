export interface Location {
  address_line1: string;
  address_line2: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
}

export interface Doctor {
  doctor_id: string;
  first_name: string;
  last_name: string;
  sex: string;
  specialty: string; // ex. Pediatrics, Gynecologist, Hematology, etc...
  location: Location;
}
