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
      break;
    case "patient":
      router.push("/patient");
      break;
    case "register":
      router.push("/registration");
      break;
    default:
      return <Login />;
  }
};

export default DashboardPage;
