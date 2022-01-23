const putDatabaseInfo = require("../../../service/database")

export default function handler(req, res) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const table_name = "patients"
    putDatabaseInfo(table_name, req.body);
    res.status(200).send(req.body);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` })
    return
  }
}
