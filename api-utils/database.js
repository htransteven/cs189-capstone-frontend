const configureDatabase = require('./configure_database');
var ddb = configureDatabase();
var AWS = require('aws-sdk');

module.exports = (table_name, params) => {
  if (!params.appointment_id && (table_name == "appointments" || table_name == "general_consults")) {
    console.log("Error: missing required appointment_id key");
  }
  if (!params.doctor_id && (table_name == "doctors")) {
    console.log("Error: missing required doctor_id key");
  }
  if (!params.patient_id && (table_name == "patients" || table_name == "appointments" || table_name == "general_consults")) {
    console.log("Error: missing required patient_id key");
  }

  var table_info = {
    TableName: table_name,
    Item: 
      AWS.DynamoDB.Converter.marshall(params)
  }

  ddb.putItem(table_info, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}