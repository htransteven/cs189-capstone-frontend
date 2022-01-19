import { createContext, useContext } from "react";
import { useUser as useAuthUser } from "@auth0/nextjs-auth0";
import { Login } from "../components/Login";
import { Role } from "../api/models";

const UserContext = createContext(null);

export const useUser = () => {
  const user = useContext(UserContext);
  return user;
};

export const useRole = (): Role => {
  const user = useContext(UserContext);
  const role = user["https://myapp/role"][0];

  switch (role) {
    case "Patient":
      return "patient";
    case "Provider":
      return "doctor";
    default:
      return null;
  }
};

export const UserProvider = ({ children }) => {
  const { user } = useAuthUser();

  if (!user) {
    return <Login />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
