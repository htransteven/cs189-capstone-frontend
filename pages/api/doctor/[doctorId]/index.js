const configureDatabase = require("../../../../api/configure_database");
var ddb = configureDatabase();
var AWS = require("aws-sdk");

export default function handler(req, res) {
  const { doctorId } = req.query;
  const table_name = "doctors";
  if (req.method === "GET") {
    var params = {
      KeyConditionExpression: "doctor_id = :doctor_id",
      ExpressionAttributeValues: {
        ":doctor_id": { S: doctorId },
      },
      TableName: table_name,
    };

    ddb.query(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(AWS.DynamoDB.Converter.unmarshall(data.Items[0]));
        console.log(
          "Success",
          JSON.stringify(AWS.DynamoDB.Converter.unmarshall(data.Items[0]))
        );
      }
    });
  } else if (req.method === "DELETE") {
    var params = {
      TableName: table_name,
      Key: {
        doctor_id: { S: doctorId },
      },
    };

    ddb.deleteItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(data);
        console.log(
          "Success: deleted item from table(doctors)",
          JSON.stringify(data)
        );
      }
    });
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
