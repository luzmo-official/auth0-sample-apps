const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const Cumulio = require('cumulio');
const CORS = require('cors');
const { expressjwt } = require('express-jwt');
const jwks = require('jwks-rsa');

dotenv.config()

var checkJwt = expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithms: ['RS256']
});

const data = {
  "integration_id": process.env.INTEGRATION_ID,
  "type": "sso",
  "expiry": "24 hours",
  "inactivity_interval": "10 minutes",
  "username": process.env.USER_USERNAME,
  "name": process.env.USER_NAME,
  "email": process.env.USER_EMAIL,
  "suborganization": process.env.USER_SUBORGANIZATION,
  "role": "viewer"
};

const cumulClient = new Cumulio({
  api_key: process.env.CUMUL_KEY,
  api_token: process.env.CUMUL_TOKEN,
  host: process.env.API_URL || 'https://api.cumul.io'
});


const app = express();
app.use(express.json());
app.use(CORS());
const port = 4001;

app.post('/', checkJwt, (req, res) => {
  console.log(req.auth, req.body);
  const decodedToken = req.auth;
  data.metadata = {
    brand: decodedToken['https://cumulio/brand']
  };
  data.username = decodedToken['sub'] || data.username;
  data.name = req.body['name'] || data.name;
  data.email = req.body['email'] || data.email;
  data.suborganization = decodedToken['https://cumulio/suborganization'] || data.suborganization;
  cumulClient.create('authorization', data).then(function (response) {
    const resp = {
      status: 'success',
      key: response.id,
      token: response.token
    };
    res.json(resp);
  })
  .catch(function (error) {
    const resp = {
      status: 'failed',
      error
    };
    res.json(resp);
  });

});

app.listen(port, () => {
  console.log(`CUMUL Server app listening on port ${port}`)
});
