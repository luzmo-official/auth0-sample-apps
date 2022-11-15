const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const jwtDecode = require('jwt-decode');
const Cumulio = require('cumulio');
const CORS = require('cors');

dotenv.config()

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
app.use(CORS());
const port = 4001;

app.get('/', (req, res) => {
  const brand = req.query.brand;
  // or you can get the token parse it and use it.
  // const decodedToken = jwtDecode(req.query.token);
  // const brand = decodedToken['https://cumulio/brand']
  data.metadata = {
    brand: brand
  };
  data.username = req.query.username || data.username;
  data.name = req.query.name || data.name;
  data.email = req.query.email || data.email;
  data.suborganization = req.query.suborganization || data.suborganization;
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
