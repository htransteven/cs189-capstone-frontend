const configureDatabase = require("../../../../api/configure_database");
var ddb = configureDatabase();
var AWS = require("aws-sdk");

const table_name = "doctors";

const handleGet = async (doctorId) => {
  var params = {
    KeyConditionExpression: "doctor_id = :doctor_id",
    ExpressionAttributeValues: {
      ":doctor_id": { S: doctorId },
    },
    TableName: table_name,
  };

  try {
    const data = await ddb.query(params).promise();
    const doctor = AWS.DynamoDB.Converter.unmarshall(data.Items[0]);
    console.log("GET doctor", doctor);
    return {
      code: 200,
      data: doctor,
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
  const { doctorId } = req.query;
  var params = {
    TableName: table_name,
    Key: {
      doctor_id: { S: doctorId },
    },
  };

  try {
    const data = await ddb.query(params).promise();
    const doctor = AWS.DynamoDB.Converter.unmarshall(data.Items[0]);
    res.status(200).json(doctor).send();
    console.log(
      "Success: deleted item from table(doctors)",
      JSON.stringify(data)
    );
    console.log("DELETE doctor", doctor);

    return {
      code: 200,
      data: doctor,
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
  const { doctorId } = req.query;
  if (req.method === "GET") {
    const { code, data } = await handleGet(doctorId);
    res.status(code).json(data);
  } else if (req.method === "DELETE") {
    const { code, data } = await handleDelete(doctorId);
    res.status(code).json(data);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
  }
};

export default handler;
