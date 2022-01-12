const configureDatabase = require('./configure_database');
var ddb = configureDatabase();

module.exports = (table_name, params) => {
  if (!params.appointment_id && (table_name == "appointments" || table_name == "general_consults")) {
    console.log("Error: missing required appointment_id key");
  } else if (!params.patient_id) {
    console.log("Error: missing required patient_id key");
  }

  if (table_name === "patients") {
    if (!params.first_name) {
      params['first_name'] = "";
    }
    if (!params.last_name) {
      params['last_name'] = "";
    }
    if (!params.sex) {
      params['sex'] = "";
    }
    if (!params.active_medications) {
      params['active_medications'] = "[]";
    }
    if (!params.preexisting_conditions) {
      params['preexisting_conditions'] = "[{}]";
    }
    if (!params.birthday) {
      params['birthday'] = "";
    }
  }
  if (table_name === "appointments") {
    if (!params.appointment_type) {
      params['appointment_type'] = "";
    }
    if (!params.doctor) {
      params['doctor'] = "";
    }
    if (!params.appointment_time) {
      params['appointment_time'] = "";
    }
  }
  if (table_name === "general_consults") {
    if (!params.doctor_diagnosis) {
      params['doctor_diagnosis'] = "";
    }
    if (!params.symptoms) {
      params['symptoms'] = "[{}]";
    }
    if (!params.initial_diagnosis) {
      params['initial_diagnosis'] = "";
    }
  }

  var table_info_patient = {
    TableName: table_name,
    Item: {
      'patient_id': {S: params.patient_id},
      'first_name': {S: params.first_name},
      'last_name': {S: params.last_name},
      'sex': {S: params.sex},
      'active_medications': {S: params.active_medications},
      'preexisting_conditions': {S: params.preexisting_conditions},
      'birthday': {S: params.birthday},
    }
  }
  var table_info_appointment = {
    TableName: table_name,
    Item: {
      'appointment_id': {N: params.appointment_id},
      'patient_id': {S: params.patient_id},
      'appointment_type': {S: params.appointment_type},
      'doctor': {S: params.doctor},
      'appointment_time': {S: params.appointment_time},
    }
  }
  var table_info_general_consult= {
    TableName: table_name,
    Item: {
      'appointment_id': {N: params.appointment_id},
      'patient_id': {S: params.patient_id},
      'doctor_diagnosis': {S: params.doctor_diagnosis},
      'symptoms': {S: params.symptoms},
      'initial_diagnosis': {S: params.initial_diagnosis},
    }
  }

  switch (table_name) {
    case 'patients':
      ddb.putItem(table_info_patient, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
      break;
    case 'appointments':
      ddb.putItem(table_info_appointment, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
      break;
    case 'general_consults':
      ddb.putItem(table_info_general_consult, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
      break;
    default:
      console.log(`Table ${table_name} does not exist`);
      break;
  }
}