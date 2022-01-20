import { PatientHome, DoctorHome } from '../../components';
import Navbar from '../../components/Navbar';
import Registration from '../../components/Registration';
import { useRole } from '../../contexts/UserContext';

const DashboardPage = () => {
  const role = useRole();
  console.log(role);
  let pageToRender = null;
  switch (role) {
    case 'patient':
      pageToRender = <PatientHome />;
      break;
    case 'doctor':
      pageToRender = <DoctorHome />;
      break;
    case null:
      pageToRender = <Registration />;
      break;
  }

  return (
    <>
      <Navbar />
      <div className="antialiased bg-gray-200 p-6 h-screen">{pageToRender}</div>
    </>
  );
};

export default DashboardPage;
