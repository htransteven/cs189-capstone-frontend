import { createContext, useContext } from "react";
import { UserProfile, useUser as useAuthUser } from "@auth0/nextjs-auth0";
import { Login } from "../components/Login";
import { Role } from "../api-utils/models";

const UserContext = createContext(null);

export const useUser = (): UserProfile => {
  const user: UserProfile = useContext(UserContext);
  user.sub = user.sub.substring(user.sub.indexOf("|") + 1);
  return user;
};

export const useRole = (): Role => {
  const user = useContext(UserContext);
  if (!user) return null;

  const roles = user["https://myapp/role"] as string[];
  let role;
  if (roles.includes("doctor")) {
    role = "doctor";
  } else {
    role = roles[0];
  }

  switch (role && role.toLowerCase()) {
    case "patient":
      return "patient";
    case "doctor":
      return "doctor";
    default:
      return "register";
  }
};

export const UserProvider = ({ children }) => {
  const { user } = useAuthUser();

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
