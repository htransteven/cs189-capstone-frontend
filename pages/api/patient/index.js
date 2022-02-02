const putDatabaseInfo = require("../../../api-utils/database");

export default function handler(req, res) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const table_name = "patients"
    const body = JSON.parse(req.body);
    putDatabaseInfo(table_name, body);
    res.status(200).send(req.body);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
