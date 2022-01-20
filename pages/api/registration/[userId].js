import axios from 'axios';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'POST' || req.method === 'PUT') {
    const patientRoleId = 'rol_IjR1g9ta8kaKJHDD';
    const { pic } = req.body;
    const authProvider = pic.includes('google') ? 'google-oauth2' : 'auth0';
    try {
      const { data } = await axios.post(
        'https://dev-1z3ey38f.us.auth0.com/oauth/token',
        {
          grant_type: 'client_credentials',
          client_id: 'nNEdq8SK5bk4Zn3oAQb5EStG2mE8L2np',
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: 'https://dev-1z3ey38f.us.auth0.com/api/v2/',
        }
      );

      var options = {
        method: 'POST',
        url: `https://dev-1z3ey38f.us.auth0.com/api/v2/users/${authProvider}|${userId}/roles`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${data.access_token}`,
          'cache-control': 'no-cache',
        },
        data: { roles: [patientRoleId] },
      };

      await axios.request(options);

      console.log('success');
      res.status(201).send({ message: 'successfully registered' });
    } catch (e) {
      res.status(500).send({ message: 'messsed up' });
      console.log(e);
    }
    console.log('userId is', userId);
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
    return;
  }
}
