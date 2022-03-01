/* eslint-disable react/no-unescaped-entities */
import styled from "styled-components";
import { useRouter } from "next/router";
import { useState, useEffect, FunctionComponent } from "react";
import { useApi } from "../../../contexts/APIClientContext";
import {
  Appointment,
  Doctor,
  Patient,
  Comment,
  ChatLogs,
} from "../../../api-utils/models";
import Navbar from "../../../components/Navbar";
import { pallete } from "../../../styles";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ChatMessage } from "../../../components";
import { formatInTimeZone } from "date-fns-tz";

const Banner = styled.div`
  background-color: ${pallete.purple};
  color: ${pallete.white};
  padding: 20px 30px;
  font-size: 1rem;
`;

const Wrapper = styled.div`
  padding: 30px 30px 0px 30px;
`;

const RowLayout = styled.div<{ gap?: number; pair?: boolean }>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-gap: ${({ gap }) => gap}px;
  width: ${({ pair }) => (pair ? "fit-content" : "100%")};
`;

const ColumnLayout = styled.div<{ gap?: number; pair?: boolean }>`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  grid-gap: ${({ gap }) => gap}px;
  width: ${({ pair }) => (pair ? "fit-content" : "100%")};
`;

const Card = styled.div`
  width: 100%;
  padding: 20px;
  background-color: ${pallete.white};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

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
  font-size: 1.2rem;
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
  font-size: 1rem;
  line-height: 1rem;
  font-weight: 400;
  letter-spacing: 0.05rem;
`;

const ChatHistory = styled.div`
  display: flex;
  height: auto;
  width: 100%;
  flex-flow: column nowrap;
  overflow-y: scroll;
  padding: 20px 20px 20px 20px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  background-color: ${pallete.white};
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${pallete.chatbot.secondaryText};
    border-radius: 10px;
  }
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
      <RowLayout pair={true}>
        <Label>Patient ID</Label>
        <Value>{patient_id}</Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>First Name</Label>
        <Value>{first_name}</Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Last Name</Label>
        <Value>{last_name}</Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Birthday</Label>
        <Value>
          {formatInTimeZone(fromUnixTime(birthday), "UTC", "MM/dd/yyyy")}
        </Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Sex</Label>
        <Value style={{ textTransform: "capitalize" }}>{sex}</Value>
      </RowLayout>
      <RowLayout pair={true}>
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
      <RowLayout pair={true}>
        <Label>Appointment ID</Label>
        <Value>{appointment_id}</Value>
      </RowLayout>
      <RowLayout gap={20}>
        <RowLayout pair={true}>
          <Label>Date</Label>
          <Value>
            {formatInTimeZone(
              fromUnixTime(appointment_time / 1000),
              "UTC",
              "MM/dd/yyyy"
            )}
          </Value>
        </RowLayout>
        <RowLayout pair={true}>
          <Label>Time</Label>
          <Value>
            {formatInTimeZone(
              fromUnixTime(appointment_time / 1000),
              "UTC",
              "hh:mm:ss a"
            )}
          </Value>
        </RowLayout>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Type</Label>
        <Value>{appointment_type}</Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Doctor</Label>
        <Value>
          {doctor.first_name} {doctor.last_name}
        </Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Specialty</Label>
        <Value style={{ textTransform: "capitalize" }}>
          {doctor.specialty}
        </Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Address Line 1</Label>
        <Value>{doctor.location.address_line1}</Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Address Line 2</Label>
        <Value>{doctor.location.address_line2}</Value>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Postal Code</Label>
        <Value>{doctor.location.postal_code}</Value>
      </RowLayout>
      <RowLayout gap={30}>
        <RowLayout pair={true}>
          <Label>City</Label>
          <Value>{doctor.location.city}</Value>
        </RowLayout>
        <RowLayout pair={true}>
          <Label>State</Label>
          <Value>{doctor.location.state}</Value>
        </RowLayout>
        <RowLayout pair={true}>
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
      <RowLayout pair={true}>
        <Label>Symptoms</Label>
        <ColumnLayout gap={10}>
          {symptoms &&
            symptoms
              .filter((symp, index) => {
                return (
                  symptoms.findIndex(
                    (a) => symp.id === a.id && symp.label === a.label
                  ) === index
                );
              })
              .map((symptoms) => (
                <Value key={`symp-${symptoms.id}`}>{symptoms.label}</Value>
              ))}
        </ColumnLayout>
      </RowLayout>
      <RowLayout pair={true}>
        <Label>Doctor's Diagnosis</Label>
        <Value>{doctor_diagnosis}</Value>
      </RowLayout>
    </Card>
  );
};

const CommentInput = styled.input`
  display: flex;
  height: 100%;
  width: 100%;
  border: 2px solid ${pallete.purple};
  padding: 6px 10px;
  border-radius: 5px;
`;

const CommentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 6px 20px;
  border-radius: 3px;
  color: ${pallete.white};
  background-color: ${pallete.purple};
  font-size: 0.8rem;
  width: fit-content;
`;

const DeleteCommentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 5px 12px;
  border-radius: 3px;
  color: ${pallete.white};
  background-color: ${pallete.textSecondary};
  font-size: 0.7rem;
`;

const CommentsSection: React.FC<{
  comments: Comment[];
  addComment: (value: string) => void;
}> = ({ comments, addComment }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addComment(input);
    setInput("");
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit}
        style={{
          minHeight: "0px",
          height: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gridGap: "10px",
        }}
      >
        <CardTitle>Comments</CardTitle>
        <ColumnLayout
          gap={15}
          style={{ maxHeight: "200px", overflowY: "scroll" }}
        >
          {comments.map((comment, index) => (
            <ColumnLayout key={`id-${index}`} gap={5}>
              <RowLayout gap={5} style={{ alignItems: "center" }} pair={true}>
                <Label>
                  {`${comment.role} - `}
                  {format(fromUnixTime(comment.time), "MM/dd/yyyy hh:mm:ss a")}
                </Label>
              </RowLayout>
              <Value>{comment.message}</Value>
            </ColumnLayout>
          ))}
        </ColumnLayout>
        <RowLayout gap={10} style={{ gridTemplateColumns: "1fr auto" }}>
          <CommentInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <CommentButton type={"submit"}>Add Comment</CommentButton>
        </RowLayout>
      </form>
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
  const [chatLogs, setChatLogs] = useState<ChatLogs[]>(null);

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
      } else {
        setPatient(pat);
      }

      const doc = await apiClient.doctors.get(appt.doctor_id);
      if (!doc) {
        alert(
          `no doc found for appointment ${appt.appointment_id} with doctor id = ${appt.doctor_id}`
        );
      } else {
        setDoctor(doc);
      }

      const logs = await apiClient.appointments.getChatLogs(
        appt.appointment_id
      );
      if (!logs) {
        alert(`no chat logs found for appointment ${appt.appointment_id}`);
      } else {
        setChatLogs(logs);
      }
    };

    getAppointment();
  }, [apiClient, appointmentId]);

  const addComment = async (value: string) => {
    const res = await apiClient.appointments.put(appointment.appointment_id, {
      ...appointment,
      comments: [
        ...appointment.comments,
        {
          author_id: patient.patient_id,
          role: "patient",
          time: getUnixTime(new Date()),
          message: value,
        },
      ],
    });

    if (!res) return;

    setAppointment({ ...appointment, ...res });
  };

  return (
    <>
      <Navbar />
      <Banner>Appointment #{appointmentId}</Banner>
      <Wrapper>
        {loading && <div>Searching for appointment #{appointmentId}</div>}
        {!loading && !appointment && <div>Appointment not found</div>}
        {appointment && patient && doctor && (
          <RowLayout gap={15}>
            <ColumnLayout
              gap={15}
              style={{
                height: "calc(100vh - 200px - 60px)",
              }}
            >
              <RowLayout gap={15}>
                <PatientInfo {...patient} />
                <AppointmentInfo {...appointment} doctor={doctor} />
                <DiagnosisInfo {...appointment} />
              </RowLayout>
              <CommentsSection
                comments={appointment.comments}
                addComment={addComment}
              />
            </ColumnLayout>
            <ChatHistory
              style={{
                height: "calc(100vh - 200px - 60px)",
              }}
            >
              <CardTitle>Chat Logs</CardTitle>
              {!chatLogs && <span>Loading chat log</span>}
              {chatLogs &&
                chatLogs.map((log, index) => (
                  <>
                    <ChatMessage
                      key={`message-${index}`}
                      message={log.input}
                      sender={"user"}
                      timestamp={log.timestamp}
                      magnify={false}
                    />
                    <ChatMessage
                      key={`message-${index}`}
                      message={log.response}
                      sender={"bot"}
                      timestamp={log.timestamp}
                      magnify={false}
                    />
                  </>
                ))}
            </ChatHistory>
          </RowLayout>
        )}
      </Wrapper>
    </>
  );
};

export default withPageAuthRequired(AppointmentPage);
