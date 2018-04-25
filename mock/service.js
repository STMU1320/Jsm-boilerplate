const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const {mockPort} = require('../config.json');

router.get('/test', (req, res) => {
  res.send('test data');
});

const server = app.listen(mockPort, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`service listen on ${host}:${port}`);
});
