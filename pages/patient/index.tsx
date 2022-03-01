import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import React, { useEffect, useState } from "react";
import { Appointment, Doctor, Patient } from "../../api-utils/models";
import { useApi } from "../../contexts/APIClientContext";
import { useRole, useUser } from "../../contexts/UserContext";
import { ChatBot } from "../../components";
import Navbar from "../../components/Navbar";
import { format, fromUnixTime } from "date-fns";
import { Tag, TagContainer } from "../../components/Tag";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

export const AppointmentCard: React.FC<Appointment> = ({
  appointment_id,
  appointment_time,
  patient_id,
  doctor_id,
  initial_diagnosis,
  tags,
}) => {
  const apiClient = useApi();
  const role = useRole();

  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
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

      const doc = await apiClient.doctors.get(doctor_id);
      if (!doc) {
        alert(
          `no doc found for appointment ${appointment_id} with doctor id = ${doctor_id}`
        );
      } else {
        setDoctor(doc);
      }
      setLoading(false);
    };

    getPatientAndDoctor();
  }, [apiClient, appointment_id, patient_id, doctor_id]);

  console.log(patient);

  return (
    <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
      <Link href={`/${role}/appointments/${appointment_id}`}>
        <a
          href=""
          className="block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden h-auto"
        >
          <header className="font-bold bg-purple-800 h-16 justify-center">
            <div className="flex justify-center pt-1">
              <h2 className="font-bold text-white">
                Appointment #{appointment_id}
              </h2>
            </div>
            <div className="flex justify-center pt-1">
              <h2 className="font-bold text-white">
                {formatInTimeZone(
                  fromUnixTime(appointment_time / 1000),
                  "UTC",
                  "EEEE, MM/dd/yyyy @ hh:mm a"
                )}
              </h2>
            </div>
          </header>
          <div className="p-4">
            <div className="flex flex-col">
              <p className="text-purple-700 text-bold">Location</p>
              <p className="text-sm">
                {loading && "Loading doctor data..."}
                {!loading && !doctor && "Failed when finding doctor..."}
                {doctor &&
                  `${doctor.location.address_line1} ${doctor.location.address_line2}, ${doctor.location.city}, ${doctor.location.state} ${doctor.location.postal_code}`}
              </p>
            </div>
            <div className="mt-3 flex flex-col">
              {loading && "Loading patient data..."}
              {!loading && !patient && "Failed when finding patient data..."}
              {patient && (
                <>
                  <p className="text-purple-700 text-bold">
                    Patient Information
                  </p>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Name: </p>
                    <p className="text-sm">
                      {patient.first_name} {patient.last_name}
                    </p>
                  </div>
                  <div className="inline-flex">
                    <p className="text-sm text-gray-600 pr-1">Birthday: </p>
                    <p className="text-sm">
                      {formatInTimeZone(
                        fromUnixTime(patient.birthday),
                        "UTC",
                        "MM/dd/yyyy"
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>

            <p className="text-purple-700 text-bold mt-3">Tags</p>
            {loading && "Loading patient data..."}
            {!loading && !patient && "Failed when finding patient data..."}
            {patient && (
              <TagContainer>
                {tags
                  ?.filter((tag) => tag.source === "pc" || tag.source === "s")
                  .map((tag, index) => (
                    <Tag
                      key={`tag-${index}-${tag.value}`}
                      text={tag.value}
                      background={
                        tag.source === "pc" ? "bg-gray-200" : "bg-purple-200"
                      }
                      textColor="text-gray-700"
                    />
                  ))}
              </TagContainer>
            )}
            <div className="mt-3 flex flex-col">
              <p className="text-purple-700 text-bold">Preconsult Status</p>
              <div className="inline-flex">
                <Tag
                  key={`tag-needs-pc`}
                  text={initial_diagnosis ? "Completed" : "Incomplete"}
                  background={initial_diagnosis ? "bg-green-200" : "bg-red-200"}
                  textColor="text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-b text-xs text-gray-700">
            <span className="flex items-center">See Report</span>
          </div>
        </a>
      </Link>
    </div>
  );
};

const PatientHome = () => {
  const user = useUser();
  const role = useRole();
  const apiClient = useApi();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [filter, setFilter] = useState<string>("Upcoming");

  useEffect(() => {
    const getAppointments = async () => {
      if (appointments) return;
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
  }, [apiClient, user.sub, role, appointments]);

  const filterAppointments = (appointments: Appointment[]): Appointment[] => {
    const currentDate = Date.now();
    const filteredAppointments = appointments
      .filter((appointment) => {
        if (filter === "Upcoming") {
          return appointment.appointment_time > currentDate;
        } else {
          return appointment.appointment_time < currentDate;
        }
      })
      .sort((a, b) => a.appointment_time - b.appointment_time);
    console.log(filteredAppointments);
    return filteredAppointments;
  };

  return (
    <>
      <Navbar />
      <div className="container flex w-full my-4 mx-auto items-center justify-end">
        <label className="mx-2">Filter Appointments</label>
        <select
          className="
                    mr-5
                    block
                    w-fit
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50
                  "
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Upcoming</option>
          <option>Past</option>
        </select>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          {loading && "Loading appointments..."}
          {!loading && !appointments && "No appointment data found"}
          {appointments &&
            filterAppointments(appointments).map((appointment) => (
              <AppointmentCard
                key={`appointment-${appointment.appointment_id}`}
                {...appointment}
              />
            ))}
        </div>
        <ChatBot
          appointments={appointments}
          onNewAppointment={() => setAppointments(null)}
        />
      </div>
    </>
  );
};

export default withPageAuthRequired(PatientHome);
