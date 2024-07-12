// index.js
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('./config');
const productsRouter = require('./routes/products');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/categories', productsRouter);

const fetchAccessToken = async () => {
  try {
    const response = await axios.post(`${config.testServerUrl}/test/auth`, {
      companyName: config.companyName,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      ownerName: config.ownerName,
      ownerMail: config.ownerMail,
      rollNo: config.rollNo
    });
    config.accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};

app.listen(port, async () => {
  await fetchAccessToken();
  console.log(`Server running at http://localhost:${port}`);
});
