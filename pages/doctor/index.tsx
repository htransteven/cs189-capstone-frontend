import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format, formatISO, fromUnixTime } from "date-fns";
import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { Appointment, Doctor, Patient } from "../../api-utils/models";
import { useApi } from "../../contexts/APIClientContext";
import { useRole, useUser } from "../../contexts/UserContext";
import Tag from "../../components/Tag";
import Navbar from "../../components/Navbar";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import styled from "styled-components";
import { pallete } from "../../styles";

const Wrapper = styled.div`
  padding: 30px;
  height: calc(100vh - 200px - 60px);
`;

const AppointmentCard: React.FC<Appointment> = ({
  appointment_id,
  patient_id,
}) => {
  const apiClient = useApi();

  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const getPatientAndDoctor = async () => {
      setLoading(true);
      const pat = await apiClient.patients.get(patient_id);
      if (!pat) {
        alert(
          `no patient found for appointment ${appointment_id} with patient id = ${patient_id}`
        );
      } else {
        setPatient(pat);
      }
      setLoading(false);
    };

    getPatientAndDoctor();
  }, [apiClient, appointment_id, patient_id]);

  return (
    <Tippy
      theme='light-border'
      content={
        <>
          {!loading && !patient && "No patient data..."}
          {loading && "Loading patient data..."}
          {patient && (
            <div
              className='items-center justify-items-center w-full whitespace-nowrap'
              style={{
                display: "grid",
                gridAutoFlow: "column",
                gridGap: "5px",
                padding: "5px",
              }}
            >
              {patient.preexisting_conditions.map((condition, index) => (
                <Tag
                  key={`pe-${index}-${condition.id}`}
                  text={condition.name}
                  background='bg-gray-200'
                  textColor='text-gray-700'
                />
              ))}
            </div>
          )}
        </>
      }
      placement={"bottom"}
    >
      <span
        style={{
          display: "flex",
          padding: "5px",
          height: "100%",
          width: "100%",
        }}
      >
        {!loading && !patient && "No patient data..."}
        {loading && "Loading patient data..."}
        {patient && `${patient.first_name} ${patient.last_name}`}
      </span>
    </Tippy>
  );
};

const DoctorHomePage = () => {
  const user = useUser();
  const role = useRole();
  const apiClient = useApi();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    const getAppointments = async () => {
      setLoading(true);
      const res = await apiClient.appointments.getAll(user.sub, role);
      setLoading(false);
      if (!res) {
        alert(
          `Failed to get all appointments for role=${role} and id=${user.sub}`
        );
        return;
      }

      setAppointments(res);
    };
    getAppointments();
  }, [apiClient, user.sub, role]);

  return (
    <>
      <Navbar />
      <Wrapper>
        {loading && "Loading appointments..."}
        {!loading && !appointments && "No appointment data found"}
        {appointments && (
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            editable
            selectable
            height={"100%"}
            eventBackgroundColor={"#6366f1"}
            eventTextColor={pallete.white}
            events={appointments.map((appointment) => {
              const event = {
                id: appointment.appointment_id,
                title: `Appointment #${appointment.appointment_id}`,
                date: formatISO(
                  fromUnixTime(appointment.appointment_time / 1000)
                ),
                startStr: formatISO(
                  fromUnixTime(appointment.appointment_time / 1000)
                ),
                endStr: formatISO(
                  fromUnixTime(appointment.appointment_time / 1000 + 60 * 60)
                ),
                url: `/${role}/appointments/${appointment.appointment_id}`,
                extendedProps: {
                  appointment_id: appointment.appointment_id,
                  patient_id: appointment.patient_id,
                },
              };
              return event;
            })}
            eventContent={(eventInfo) => (
              <AppointmentCard {...eventInfo.event.extendedProps} />
            )}
            eventClick={(info) => console.log(info)}
          />
        )}
      </Wrapper>
    </>
  );
};

export default withPageAuthRequired(DoctorHomePage);
