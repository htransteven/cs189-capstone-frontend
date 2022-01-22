const putDatabaseInfo = require("../../../api-utils/database");
const configureDatabase = require("../../../api-utils/configure_database");
var ddb = configureDatabase();

export default function handler(req, res) {
  const table_name = "appointments";
  if (req.method === "POST" || req.method === "PUT") {
    const body = JSON.parse(req.body);
    putDatabaseInfo(table_name, body);
    res.status(200).json(body);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
