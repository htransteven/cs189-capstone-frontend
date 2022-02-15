import React, { ReactElement, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useApi } from "../contexts/APIClientContext";
import { Patient, Condition, Medication } from "../api-utils/models";
import useSWR from "swr";
import Modal from "./Modal";
import { getUnixTime } from "date-fns";

interface infermedicaCondition {
  id: string;
  type: string;
  name: string;
  common_name: string;
}

const fetcher = (url) => fetch(url).then((r) => r.json());

const Registration = (): ReactElement => {
  const apiClient = useApi();
  const { user } = useUser();

  const initialPatient: Patient = {
    patient_id: user.sub,
    first_name: user.name,
    last_name: user.name,
    email: user.email,
    birthday: 0,
    sex: "N/A",
    active_medications: [],
    preexisting_conditions: [],
    primary_doctor_id: "61a92e6e9d9996006a5b3b35",
  };

  const emptyMedication: Medication = {
    name: "",
    dosage: "",
    timesPerWeek: 0,
  };

  const { data: infermedicaData, error: swrError } = useSWR(
    "/api/conditions",
    fetcher
  );
  const [patient, setPatient] = useState<Patient>(initialPatient);
  const [currentMed, setCurrentMed] = useState<Medication>(emptyMedication);
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [searchRes, setSearchRes] = useState<infermedicaCondition[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  console.log(patient);
  console.log("search is", searchRes);

  useEffect(() => {
    if (currentSearch == "") {
      setSearchRes([]);
    }
    if (infermedicaData && infermedicaData.length > 0 && currentSearch !== "") {
      setSearchRes(
        infermedicaData.filter((el: infermedicaCondition) => {
          const searchTerm = currentSearch.toLowerCase();
          return (
            el.common_name.toLowerCase().includes(searchTerm) ||
            el.name.toLowerCase().includes(searchTerm)
          );
        })
      );
    }
  }, [infermedicaData, currentSearch]);

  const addCondition = (condition: infermedicaCondition) => {
    if (!patient.preexisting_conditions.some((e) => e.id === condition.id)) {
      const newConditions = [
        ...patient.preexisting_conditions,
        { id: condition.id, name: condition.name },
      ];
      setPatient({
        ...patient,
        preexisting_conditions: newConditions,
      });
      setCurrentSearch("");
    } else {
      setError("Already added this pre-existing condition");
    }
  };

  const addMedication = () => {
    if (
      currentMed.name === "" ||
      currentMed.dosage === "" ||
      currentMed.timesPerWeek <= 0 ||
      Number.isNaN(currentMed.timesPerWeek)
    ) {
      setError("Please fill out all medication fields");
    } else if (
      patient.active_medications.some((e) => e.name === currentMed.name)
    ) {
      setError("Medication already exists in list");
    } else {
      setPatient({
        ...patient,
        active_medications: [...patient.active_medications, currentMed],
      });
      setError("");
      setCurrentMed(emptyMedication);
    }
  };

  const submitRegistration = async () => {
    if (patient.birthday === 0 || patient.sex === "N/A") {
      setError("Please fill out Birthday and/or Gender before submitting");
    } else {
      const res = await apiClient.patients.post(patient, user.picture);

      if (res) {
        setModal(true);
      }
    }
  };

  return (
    <div className='container'>
      <div
        className='my-6 bg-blue-100 rounded-md border border-blue-500 text-blue-700 px-4 py-3'
        role='alert'
      >
        <p className='font-bold'>Welcome to BRAD</p>
        <p className='text-sm'>
          Hello new patient! Please complete this registration form.
        </p>
      </div>
      {modal && <Modal countdownInterval={10} cancel={() => setModal(false)} />}
      {error && (
        <div
          className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 relative'
          role='alert'
        >
          <p className='font-bold'>Error</p>
          <p>{error}</p>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg
              className='fill-current h-6 w-6 text-red-500'
              role='button'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              onClick={() => setError("")}
            >
              <title>Close</title>
              <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
            </svg>
          </span>
        </div>
      )}
      <div className='block max-w-sm mx-auto'>
        <strong className='text-gray-800'>Birthday</strong>
        <input
          type='date'
          onChange={(e) => {
            const currentDate = new Date();
            const selectedDate = new Date(e.target.value);
            if (selectedDate < currentDate) {
              setPatient({
                ...patient,
                birthday: getUnixTime(selectedDate),
              });
              setError("");
            } else {
              setError("Please select date in the past");
            }
          }}
          className='
              mt-1
              block
              w-6/12
              rounded-md
              border-gray-300
              shadow-sm
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            '
        />
      </div>

      <div className='block max-w-sm mx-auto'>
        <strong className='text-gray-800'>Gender</strong>
        <select
          onChange={(e) => {
            setPatient({ ...patient, sex: e.target.value });
            setError("");
          }}
          className='
                    block
                    w-6/12
                    mt-1
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  '
          defaultValue='Select'
        >
          <option disabled>Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Prefer Not to Say</option>
        </select>
      </div>

      <div className='block max-w-lg mx-auto'>
        <strong>Your pre-exisitng conditions</strong>
        <div className='mt-2 flex flex-col'>
          {patient.preexisting_conditions.map((condition: Condition) => {
            return (
              <div key={condition.id} className='inline-flex items-center'>
                <span className='mr-2'>- {condition.name}</span>
                <svg
                  className='fill-red-500'
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  onClick={() => {
                    let preConditions = patient.preexisting_conditions;
                    const index = preConditions.findIndex(
                      (e) => e.id === condition.id && e.name === condition.name
                    );
                    preConditions.splice(index, 1);

                    setPatient({
                      ...patient,
                      preexisting_conditions: preConditions,
                    });
                  }}
                >
                  <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      <div className='block max-w-lg mx-auto border-gray-300'>
        <strong className='text-gray-800'>
          Search and select pre-existing conditions
        </strong>
        <input
          type='search'
          className='
                    form-input 
                    block
                    w-9/12
                    mt-1
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          placeholder='eg: diabetes'
          value={currentSearch}
          onChange={(e) => setCurrentSearch(e.target.value)}
        />
        <div className='flex flex-col mt-0.5'>
          {searchRes.length > 0 && (
            <div className='relative p-1 bg-white flex flex-col h-52 w-52 shadow-lg ring-1 ring-black/1 rounded-xl overflow-auto'>
              {searchRes.map((condition: infermedicaCondition) => {
                return (
                  <span
                    className='justify-center my-0.5 rounded-md border hover:border-gray-300 hover:bg-gray-200 hover:cursor-default'
                    onClick={() => addCondition(condition)}
                    key={condition.id}
                  >
                    {condition.common_name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className='block max-w-2xl mx-auto'>
        <strong className='text-gray-800'>Medication List</strong>
        <div className='mt-2 flex flex-col'>
          {patient.active_medications.map((med) => {
            return (
              <div
                key={med.name + med.dosage}
                className='inline-flex items-center'
              >
                <span className='mr-1'>
                  - {med.name} {med.dosage} {med.timesPerWeek} /week
                </span>
                <svg
                  className='ml-1 fill-red-500'
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  onClick={() => {
                    let meds = patient.active_medications;
                    const index = meds.findIndex(
                      (e) =>
                        e.name === med.name &&
                        e.dosage === med.dosage &&
                        e.timesPerWeek === med.timesPerWeek
                    );
                    meds.splice(index, 1);

                    setPatient({
                      ...patient,
                      active_medications: meds,
                    });
                  }}
                >
                  <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
                </svg>
              </div>
            );
          })}
        </div>
        <strong className='text-gray-800'>Add Medication</strong>
        <div className='inline-flex mt-2'>
          <label className='inline-flex items-center'>
            <input
              type='text'
              className='
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  '
              value={currentMed.name}
              onChange={(e) =>
                setCurrentMed({ ...currentMed, name: e.target.value })
              }
              placeholder='Medication Name'
            />
          </label>
          <label className='inline-flex items-center mx-2'>
            <input
              type='text'
              className='
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  '
              value={currentMed.dosage}
              onChange={(e) =>
                setCurrentMed({ ...currentMed, dosage: e.target.value })
              }
              placeholder='Dosage eg: 30mg'
            />
          </label>
          <label className='inline-flex items-center mx-1'>
            <input
              type='number'
              className='form-input mt-1 block w-16 rounded-md border-gray-300 shadow-sm block focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              placeholder='0'
              value={currentMed.timesPerWeek}
              onChange={(e) =>
                setCurrentMed({
                  ...currentMed,
                  timesPerWeek: parseInt(e.target.value),
                })
              }
            />
            <span className='ml-2'>times a week</span>
          </label>
          <button
            onClick={addMedication}
            className='w-full h-10 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-400 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
          >
            Add
          </button>
        </div>
      </div>

      <div className='block max-w-2xl mx-auto'>
        <button
          className='mx-auto mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-400 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
          onClick={submitRegistration}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Registration;
