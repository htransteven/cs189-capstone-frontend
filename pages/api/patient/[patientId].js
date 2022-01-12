const configureDatabase = require('../../../service/configure_database');
var ddb = configureDatabase();
var AWS = require('aws-sdk');

export default function handler(req, res) {
  const { patientId } = req.query
  const table_name = "patients"
  if (req.method === 'GET') {
    var params = {
      KeyConditionExpression: 'patient_id = :patient_id',
      ExpressionAttributeValues: {
        ':patient_id': {'S': patientId}
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
      TableName: table_name,
      Key: {
        'patient_id' : {S: patientId}
      }
    };
  
    ddb.deleteItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      res.status(200).json(data);
      console.log("Success: deleted item from table(patients)", JSON.stringify(data));
    }
    });
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` })
    return
  }
}