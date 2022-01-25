/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "next/router";
import { Login } from "../components";
import { useRole } from "../contexts/UserContext";

const DashboardPage = () => {
  const role = useRole();
  const router = useRouter();

  switch (role) {
    case "doctor":
      router.replace("/doctor");
    case "patient":
      router.replace("/patient");
    default:
      return <Login />;
  }
};

export default DashboardPage;
