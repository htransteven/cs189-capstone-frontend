import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";
import { Patient } from "../../api-utils/models";
import Navbar from "../../components/Navbar";
import Registration from "../../components/Registration";
import { useRole, useUser } from "../../contexts/UserContext";

const RegistrationPage = (): ReactElement => {
  const role = useRole();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (role === "doctor") {
      router.push("/doctor");
    }
    if (role === "patient") {
      router.push("/patient");
    }
  }, [role, router]);

  const initialPatient: Patient = {
    patient_id: user.sub,
    first_name: user.name,
    last_name: user.name,
    email: user.email,
    birthday: 0,
    sex: "N/A",
    active_medications: [],
    preexisting_conditions: [],
    primary_doctor_id: "61a92e6e9d9996006a5b3b35",
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <Registration initialPatient={initialPatient} regType={true} />
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(RegistrationPage);
