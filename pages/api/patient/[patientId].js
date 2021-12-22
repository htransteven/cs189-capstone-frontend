const configureDatabase = require('../service/configure_database');
var ddb = configureDatabase();

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { patientId } = req.query
    var params = {
      KeyConditionExpression: 'patient_id = :patient_id',
      ExpressionAttributeValues: {
        ':patient_id': {'N': patientId}
      },
      TableName: 'patient'
    };
  
    ddb.query(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(data.Items);
        console.log("Success", JSON.stringify(data.Items));
      }
    });
  } else {
    res.status(400).send({ message: 'Only GET requests allowed' })
    return
  }
}