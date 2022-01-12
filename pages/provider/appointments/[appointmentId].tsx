import styled from "styled-components";
import { useRouter } from "next/router";
import { useState, useEffect, FunctionComponent } from "react";
import { useApi } from "../../../contexts/APIClientContext";
import { Appointment, Patient } from "../../../api/models";
import Navbar from "../../../components/Navbar";
import { pallete } from "../../../styles";
import { format, fromUnixTime } from "date-fns";

const Banner = styled.div`
  background-color: ${pallete.purple};
  color: ${pallete.white};
  padding: 20px 50px;
  font-size: 1.5rem;
`;

const RowLayout = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const PatientInfoContainer = styled.div`
  padding: 20px;
  background-color: ${pallete.offwhite};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

  & > ${RowLayout} {
    margin: 10px 0;

    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const Label = styled.div`
  color: ${pallete.textSecondary};
  font-size: 0.9rem;
  line-height: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  margin-right: 5px;
  text-transform: capitalize;
`;

const Value = styled.div`
  font-size: 1rem;
  line-height: 1rem;
  letter-spacing: 1px;
`;

const PatientInfo: FunctionComponent<Patient> = ({
  patient_id,
  first_name,
  last_name,
  birthday,
  sex,
  preexisting_conditions,
}) => {
  return (
    <PatientInfoContainer>
      <RowLayout>
        <Label>Patient ID</Label>
        <Value>{patient_id}</Value>
      </RowLayout>
      <RowLayout>
        <Label style={{ textTransform: "capitalize" }}>First Name</Label>
        <Value>{first_name}</Value>
      </RowLayout>
      <RowLayout>
        <Label style={{ textTransform: "capitalize" }}>Last Name</Label>
        <Value>{last_name}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Birthday</Label>
        <Value>
          {format(fromUnixTime(parseInt(birthday, 10)), "MM/dd/yyyy")}
        </Value>
      </RowLayout>
      <RowLayout>
        <Label>Sex</Label>
        <Value style={{ textTransform: "capitalize" }}>{sex}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Pre-existing Conditions</Label>
        <ColumnLayout>
          {preexisting_conditions &&
            preexisting_conditions.map((condition) => (
              <Value key={condition.id}>{condition.name}</Value>
            ))}
        </ColumnLayout>
      </RowLayout>
    </PatientInfoContainer>
  );
};

const AppointmentPage = () => {
  const router = useRouter();
  const { appointmentId } = router.query;
  const apiClient = useApi();
  const [appointment, setAppointment] = useState<Appointment>(null);
  const [patient, setPatient] = useState<Patient>(null);

  useEffect(() => {
    const getAppointment = async () => {
      const appt = await apiClient.appointments.get(appointmentId as string);
      if (!appt) {
        alert("no appointment found!");
        return;
      }

      setAppointment(appt);
      const pat = await apiClient.patients.get(appt.patient_id);
      if (!pat) {
        alert(
          `no patient found for appointment ${appt.appointment_id} with patient id = ${appt.patient_id}`
        );
        return;
      }
      console.log(pat);
      setPatient(pat);
    };

    getAppointment();
  }, [apiClient, appointmentId]);

  return (
    <>
      <Navbar />
      {!appointment && <div>Appointment not found</div>}
      {appointment && patient && (
        <div>
          <Banner>Appointment #{appointment.appointment_id}</Banner>
          <RowLayout style={{ padding: "30px" }}>
            <PatientInfo {...patient} />
          </RowLayout>
        </div>
      )}
    </>
  );
};

export default AppointmentPage;
