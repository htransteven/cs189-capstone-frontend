/* eslint-disable react/no-unescaped-entities */
import styled from "styled-components";
import { useRouter } from "next/router";
import { useState, useEffect, FunctionComponent } from "react";
import { useApi } from "../../../contexts/APIClientContext";
import { Appointment, Doctor, Patient } from "../../../api/models";
import Navbar from "../../../components/Navbar";
import { pallete } from "../../../styles";
import { format, fromUnixTime } from "date-fns";

const Banner = styled.div`
  background-color: ${pallete.purple};
  color: ${pallete.white};
  padding: 20px 30px;
  font-size: 1rem;
`;

const Wrapper = styled.div`
  padding: 30px;
`;

const RowLayout = styled.div<{ gap?: number }>`
  display: flex;
  flex-flow: row nowrap;

  & > * {
    margin: 0 ${({ gap }) => gap / 2}px;

    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const ColumnLayout = styled.div<{ gap?: number }>`
  display: flex;
  flex-flow: column nowrap;

  & > * {
    margin: ${({ gap }) => gap / 2}px 0;

    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const Card = styled.div`
  padding: 35px;
  background-color: ${pallete.white};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;

  & > ${RowLayout} {
    margin: 15px 0;

    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const CardTitle = styled.span`
  display: flex;
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 700;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
`;

const Label = styled.div`
  color: ${pallete.textSecondary};
  font-size: 0.9rem;
  line-height: 1rem;
  letter-spacing: 0.05rem;
  font-weight: 500;
  margin-right: 10px;
  text-transform: capitalize;
`;

const Value = styled.div`
  color: ${pallete.textPrimary};
  font-size: 1.2rem;
  line-height: 1rem;
  font-weight: 400;
  letter-spacing: 0.05rem;
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
    <Card>
      <CardTitle>Patient Info</CardTitle>
      <RowLayout>
        <Label>Patient ID</Label>
        <Value>{patient_id}</Value>
      </RowLayout>
      <RowLayout>
        <Label>First Name</Label>
        <Value>{first_name}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Last Name</Label>
        <Value>{last_name}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Birthday</Label>
        <Value>{format(fromUnixTime(birthday), "MM/dd/yyyy")}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Sex</Label>
        <Value style={{ textTransform: "capitalize" }}>{sex}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Pre-existing Conditions</Label>
        <ColumnLayout gap={10}>
          {preexisting_conditions.map((condition) => (
            <Value key={`pe-${condition.id}`}>{condition.name}</Value>
          ))}
        </ColumnLayout>
      </RowLayout>
    </Card>
  );
};

const AppointmentInfo: React.FC<Appointment & { doctor: Doctor }> = ({
  appointment_id,
  appointment_time,
  appointment_type,
  doctor,
}) => {
  return (
    <Card>
      <CardTitle>Appointment Info</CardTitle>
      <RowLayout>
        <Label>Appointment ID</Label>
        <Value>{appointment_id}</Value>
      </RowLayout>
      <RowLayout gap={20}>
        <RowLayout>
          <Label>Date</Label>
          <Value>{format(fromUnixTime(appointment_time), "MM/dd/yyyy")}</Value>
        </RowLayout>
        <RowLayout>
          <Label>Time</Label>
          <Value>{format(fromUnixTime(appointment_time), "hh:mm:ss a")}</Value>
        </RowLayout>
      </RowLayout>
      <RowLayout>
        <Label>Type</Label>
        <Value>{appointment_type}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Doctor</Label>
        <Value>
          {doctor.first_name} {doctor.last_name}
        </Value>
      </RowLayout>
      <RowLayout>
        <Label>Specialty</Label>
        <Value style={{ textTransform: "capitalize" }}>
          {doctor.specialty}
        </Value>
      </RowLayout>
      <RowLayout>
        <Label>Address Line 1</Label>
        <Value>{doctor.location.address_line1}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Address Line 2</Label>
        <Value>{doctor.location.address_line2}</Value>
      </RowLayout>
      <RowLayout>
        <Label>Postal Code</Label>
        <Value>{doctor.location.postal_code}</Value>
      </RowLayout>
      <RowLayout gap={30}>
        <RowLayout>
          <Label>City</Label>
          <Value>{doctor.location.city}</Value>
        </RowLayout>
        <RowLayout>
          <Label>State</Label>
          <Value>{doctor.location.state}</Value>
        </RowLayout>
        <RowLayout>
          <Label>Country</Label>
          <Value>{doctor.location.country}</Value>
        </RowLayout>
      </RowLayout>
    </Card>
  );
};

const DiagnosisInfo: React.FC<Appointment> = ({
  doctor_diagnosis,
  initial_diagnosis,
  symptoms,
}) => {
  return (
    <Card>
      <CardTitle>Diagnosis Info</CardTitle>
      <RowLayout>
        <Label>Symptoms</Label>
        <ColumnLayout gap={10}>
          {symptoms.map((symptoms) => (
            <Value key={`symp-${symptoms.id}`}>{symptoms.label}</Value>
          ))}
        </ColumnLayout>
      </RowLayout>
      <RowLayout>
        <Label>Initial Diagnosis</Label>
        <ColumnLayout gap={10}>
          {initial_diagnosis.map((diagnosis, index) => (
            <Value key={`id-${index}`}>{diagnosis}</Value>
          ))}
        </ColumnLayout>
      </RowLayout>
      <RowLayout>
        <Label>Doctor's Diagnosis</Label>
        <Value>{doctor_diagnosis}</Value>
      </RowLayout>
    </Card>
  );
};

const AppointmentPage = () => {
  const router = useRouter();
  const { appointmentId } = router.query;
  const apiClient = useApi();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment>(null);
  const [patient, setPatient] = useState<Patient>(null);
  const [doctor, setDoctor] = useState<Doctor>(null);

  useEffect(() => {
    const getAppointment = async () => {
      setLoading(true);
      const appt = await apiClient.appointments.get(
        parseInt(appointmentId as string, 10)
      );
      setLoading(false);
      if (!appt) {
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
      setPatient(pat);

      const doc = await apiClient.doctors.get(appt.doctor_id);
      if (!doc) {
        alert(
          `no doc found for appointment ${appt.appointment_id} with doctor id = ${appt.doctor_id}`
        );
        return;
      }
      setDoctor(doc);
    };

    getAppointment();
  }, [apiClient, appointmentId]);

  return (
    <>
      <Navbar />
      <Banner>Appointment #{appointmentId}</Banner>
      <Wrapper>
        {loading && <div>Searching for appointment #{appointmentId}</div>}
        {!loading && !appointment && <div>Appointment not found</div>}
        {appointment && patient && doctor && (
          <RowLayout gap={15}>
            <PatientInfo {...patient} />
            <AppointmentInfo {...appointment} doctor={doctor} />
            <DiagnosisInfo {...appointment} />
          </RowLayout>
        )}
      </Wrapper>
    </>
  );
};

export default AppointmentPage;
