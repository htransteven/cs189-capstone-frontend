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
      router.replace("/doctor");
      break;
    case "patient":
      router.replace("/patient");
      break;
    case "register":
      router.replace("/registration");
      break;
    default:
      return <Login />;
  }
};

export default DashboardPage;
