import { useRole } from "../contexts/UserContext";
import { useRouter } from "next/router";

const AuthWrapper = ({ children }) => {
  const role = useRole();
  const router = useRouter();

  if (router.asPath.includes("/doctor") && role !== "doctor") {
    router.replace("/dashboard");
    return <></>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
