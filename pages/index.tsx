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
      return;
    case "patient":
      router.replace("/patient");
      return;
    default:
      return <Login />;
  }
};

export default DashboardPage;
