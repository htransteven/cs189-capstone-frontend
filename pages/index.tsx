/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "next/router";
import { Login } from "../components";
import Registration from "../components/Registration";
import { useRole } from "../contexts/UserContext";

const DashboardPage = () => {
  const role = useRole();
  const router = useRouter();

  switch (role) {
    case "doctor":
      router.push("/doctor");
      return null;
    case "patient":
      router.push("/patient");
      return null;
    case "register":
      router.push("/registration");
      return null;
    default:
      return <Login />;
  }
};

export default DashboardPage;
