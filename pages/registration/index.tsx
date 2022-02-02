import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import React, { ReactElement, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Registration from "../../components/Registration";
import { useRole, useUser } from "../../contexts/UserContext";

const RegistrationPage = (): ReactElement => {
  const user = useUser();
  console.log('user is ', user)

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <Registration />
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(RegistrationPage);
