const configureDatabase = require("../../../api-utils/configure_database");
var ddb = configureDatabase();
var AWS = require("aws-sdk");

export default function handler(req, res) {
  const { appointmentId } = req.query;
  const table_name = "appointments";
  res.status(400).send({ message: `${req.method} is not a valid request` });
  return;
}
