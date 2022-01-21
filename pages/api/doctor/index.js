const putDatabaseInfo = require("../../../api/database");

export default function handler(req, res) {
  if (req.method === "POST" || req.method === "PUT") {
    const table_name = "doctors";
    const body = JSON.parse(req.body);
    putDatabaseInfo(table_name, body);
    res.status(200).json(body);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
