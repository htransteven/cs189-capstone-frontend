const putDatabaseInfo = require("./service/database")

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { table_name } = req.query
    const body = JSON.parse(req.body)
    putDatabaseInfo(table_name, body);
    res.status(200).json({
      the_table_name : table_name,
      body: body,
      theapptid: body.appointment_id
     });
    } else {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }
}