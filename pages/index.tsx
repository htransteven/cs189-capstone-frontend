import { PatientHome, DoctorHome } from "../components";
import Navbar from "../components/Navbar";
import { useRole } from "../contexts/UserContext";

const DashboardPage = () => {
  const role = useRole();

  let pageToRender = null;
  switch (role) {
    case "patient":
      pageToRender = <PatientHome />;
    case "doctor":
      pageToRender = <DoctorHome />;
  }

  return (
    <>
      <Navbar />
      <div className="antialiased bg-gray-200 p-6 h-screen">{pageToRender}</div>
    </>
  );
};

export default DashboardPage;
