const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const jwtDecode = require('jwt-decode');
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
  "inactivity_interval": "1 year",
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
// app.use(express.urlencoded());
app.use(CORS());
const port = 4001;

app.post('/', checkJwt, (req, res) => {
  // const token = req.headers.authorization.split(' ')[1];
  // const decodedToken = jwtDecode(token);
  // const brand = decodedToken['https://cumulio/brand']
  console.log(req.auth, req.body);
  const decodedToken = req.auth;
  data.metadata = {
    brand: decodedToken['https://cumulio/brand']
  };
  data.username = req.body['username'] || data.username;
  data.name = req.body['name'] || data.name;
  data.email = req.body['email'] || data.email;
  data.suborganization = req.body['suborganization'] || data.suborganization;
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

  // let config = {
  //   method: 'post',
  //   url: `${process.env.API_URL || 'https://api.cumul.io'}/0.1.0/authorization`,
  //   headers: { 
  //     'Content-Type': 'application/json'
  //   },
  //   data : JSON.stringify(data)
  // };
  // axios(config)
  // .then(function (response) {
  //   const resp = {
  //     status: 'success',
  //     key: response.data.id,
  //     token: response.data.token
  //   };
  //   res.json(resp);
  // })
  // .catch(function (error) {
  //   const resp = {
  //     status: 'failed',
  //     error
  //   };
  //   res.json(resp);
  // });
});

app.listen(port, () => {
  console.log(`CUMUL Server app listening on port ${port}`)
});
