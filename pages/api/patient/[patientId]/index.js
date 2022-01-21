const configureDatabase = require("../../../../api/configure_database");
var ddb = configureDatabase();
var AWS = require("aws-sdk");

const table_name = "patients";

const handleGet = async (patientId) => {
  var params = {
    KeyConditionExpression: "patient_id = :patient_id",
    ExpressionAttributeValues: {
      ":patient_id": { S: patientId },
    },
    TableName: table_name,
  };

  try {
    const data = await ddb.query(params).promise();
    const patient = AWS.DynamoDB.Converter.unmarshall(data.Items[0]);
    console.log("GET Patient", patient);
    return {
      code: 200,
      data: patient,
    };
  } catch (err) {
    console.log("Error", err);
    return {
      code: 400,
      data: err,
    };
  }
};

const handleDelete = async (req, res) => {
  const { patientId } = req.query;
  var params = {
    TableName: table_name,
    Key: {
      patient_id: { S: patientId },
    },
  };

  try {
    const data = await ddb.query(params).promise();
    const patient = AWS.DynamoDB.Converter.unmarshall(data.Items[0]);
    res.status(200).json(patient).send();
    console.log(
      "Success: deleted item from table(patients)",
      JSON.stringify(data)
    );
    console.log("DELETE Patient", patient);

    return {
      code: 200,
      data: patient,
    };
  } catch (err) {
    console.log("Error", err);

    return {
      code: 400,
      data: err,
    };
  }
};

const handler = async (req, res) => {
  const { patientId } = req.query;
  if (req.method === "GET") {
    const { code, data } = await handleGet(patientId);
    res.status(code).json(data);
  } else if (req.method === "DELETE") {
    const { code, data } = await handleDelete(patientId);
    res.status(code).json(data);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
  }
};

export default handler;
