export interface Location {
  address1: string;
  address2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  sex: string;
  speciality: string; // ex. Pediatrics, Gynecologist, Hematology, etc...
  location: Location;
}
