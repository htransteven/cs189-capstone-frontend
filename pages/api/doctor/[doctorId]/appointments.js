const configureDatabase = require("../../../../api-utils/configure_database");
var ddb = configureDatabase();
var AWS = require("aws-sdk");

export default function handler(req, res) {
  const table_name = "appointments";
  if (req.method === "GET") {
    const { doctorId } = req.query;

    if (!doctorId) {
      res
        .status(400)
        .send({ message: `Query params do not contain doctor_id` });
      return;
    }
    var params = {
      TableName: table_name,
      IndexName: "doctor_id-index",
      KeyConditionExpression: "doctor_id = :doctor_id",
      ExpressionAttributeValues: {
        ":doctor_id": { S: doctorId },
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
