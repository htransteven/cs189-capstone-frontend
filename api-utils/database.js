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

  ddb.describeTable({TableName: table_name}, function(err, table_data) {
    if (err) {
      console.log("Error", err);
    } else {
      // get marshalled table keys
      var table_keys = table_data.Table.KeySchema;
      var unmarshalled_keys = {};
      var key_name;
      for (let i = 0; i < table_keys.length; i++) {
        key_name = table_keys[i].AttributeName;
        unmarshalled_keys[key_name] = params[key_name];
      }
      var marshalled_keys = AWS.DynamoDB.Converter.marshall(unmarshalled_keys);

      // get update expression and add expression attribute values
      var update_expression = "set";
      var expression_attribute_values = {};
      for (const table_item of Object.keys(params)) {
        if (!(table_item in marshalled_keys)) {
          // update expression with more values to add in
          update_expression = update_expression.concat(" ", table_item, " = :", table_item, ",");
          // make sure these values are defined in expression attribute values
          expression_attribute_values[":".concat(table_item)] = params[table_item];
        }
      }
      // remove the last extra comma in the list
      update_expression = update_expression.substring(0, update_expression.length - 1);
      var marshalled_expression_attribute_values = AWS.DynamoDB.Converter.marshall(expression_attribute_values);

      // compile information for the updateitem param
      var table_info = {
        TableName: table_name,
        Key: marshalled_keys,
        UpdateExpression: update_expression,
        ExpressionAttributeValues: marshalled_expression_attribute_values,
        ReturnValues: "ALL_NEW",
      }
      ddb.updateItem(table_info, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    }
  });
}