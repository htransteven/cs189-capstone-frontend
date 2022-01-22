const configureDatabase = require("../../../../api-utils/configure_database");
var ddb = configureDatabase();
var AWS = require("aws-sdk");

export default function handler(req, res) {
  const table_name = "appointments";
  if (req.method === "GET") {
    const { patientId } = req.query;

    if (!patientId) {
      res
        .status(400)
        .send({ message: `Query params do not contain patient_id` });
      return;
    }
    var params = {
      TableName: table_name,
      IndexName: "patient_id-index",
      KeyConditionExpression: "patient_id = :patient_id",
      ExpressionAttributeValues: {
        ":patient_id": { S: patientId },
      },
    };

    ddb.query(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        res
          .status(200)
          .json(
            data.Items.map((item) => AWS.DynamoDB.Converter.unmarshall(item))
          );
        console.log("Success", data.Items);
        return;
      }
    });
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
