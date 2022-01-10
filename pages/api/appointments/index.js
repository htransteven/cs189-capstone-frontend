const putDatabaseInfo = require("../service/database")
const configureDatabase = require('../service/configure_database');
var ddb = configureDatabase();

export default function handler(req, res) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const table_name = "appointment"
    const body = JSON.parse(req.body)
    putDatabaseInfo(table_name, body);
    res.status(200).json(body);
  } else if (req.method === 'GET') {
    const query = (req.query)
    if (query.patient_id) {
      const pat_id = query.patient_id
      var params={
        TableName: 'appointment',
        IndexName: 'patient_id-index',
        KeyConditionExpression: 'patient_id = :patient_id',
        ExpressionAttributeValues: {
          ':patient_id': {'N': pat_id}
        }
      }

      ddb.query(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          res.status(200).json(data.Items)
          console.log("Success", data.Items);
        }
      });

    } else {
      res.status(400).send({ message: `Query params do not contain patient_id` })
    }
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` })
    return
  }
}
