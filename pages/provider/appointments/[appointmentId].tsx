import { useRouter } from "next/router";

const AppointmentPage = () => {
  const router = useRouter();
  const { appointmentId } = router.query;

  return <p>{appointmentId}</p>;
};

export default AppointmentPage;
