import axios from 'axios';
import { json } from 'express/lib/response';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data } = await axios.get('https://api.infermedica.com/v3/concepts?types=condition', {
        headers: {
          'App-Id': 'ba75caed', 
          'App-Key': '7743bff536386830196e42a8fc056709'
        }
      })

      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({ message: 'messsed up' });
      console.log(e);
    }
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
