const configureDatabase = require('../../../service/configure_database');
var ddb = configureDatabase();
var AWS = require('aws-sdk');

export default function handler(req, res) {
  const { appointmentId } = req.query
  const table_name = "general_consults"
  if (req.method === 'GET') {
    var params = {
      KeyConditionExpression: 'appointment_id = :appointment_id',
      ExpressionAttributeValues: {
        ':appointment_id': {'N': appointmentId}
      },
      TableName: table_name
    };
  
    ddb.query(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(AWS.DynamoDB.Converter.unmarshall(data.Items[0]));
        console.log("Success", JSON.stringify(AWS.DynamoDB.Converter.unmarshall(data.Items[0])));
      }
    });
  } else if (req.method === 'DELETE') {
    var params = {
      KeyConditionExpression: 'appointment_id = :appointment_id',
      ExpressionAttributeValues: {
        ':appointment_id': {'N': appointmentId}
      },
      TableName: table_name
    };
  
    ddb.query(params, function(err, data) {
      if (err) {
        console.log("Error in retrieving appointment", err);
      } else if (data.Items[0]) {
        console.log("Success", JSON.stringify(data.Items));
        var params_del = {
          TableName: table_name,
          Key: {
            'appointment_id': {'N': appointmentId},
            'patient_id' : {'S': data.Items[0].patient_id.S}
          }
        };
      
        ddb.deleteItem(params_del, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          res.status(200).json(data);
          console.log("Success: deleted item from table(general_consults)", JSON.stringify(data));
        }
        });
      } else {
        console.log("Error in retrieving patient id from appointment id", err);
        res.status(400).send({ message: 'Error in retreiving patient id from appointment id' })
      }
    });
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` })
    return
  }
}