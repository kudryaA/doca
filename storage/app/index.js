'use strict';

const express = require('express');
const fileUpload = require('express-fileupload');
const { readConfiguration } = require('./read_configuration');
const { createController } = require('./controller');

async function start() {
  const properties = await readConfiguration();
  const port = properties.storage.port;
  const app = express();
  app.use(fileUpload({}));
  app.use(express.json({ limit: '1024gb', extended: true }));
  app.use(express.urlencoded({ limit: '1024gb', extended: true }));
  
  createController(app, properties);
  
  app.listen(port, () => {  });
}

start();