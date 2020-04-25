'use strict';

const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');

function generateId() {
  return crypto.randomBytes(20).toString('hex');
}

/**
 * Create path
 */
exports.generate = (type, configuration) => {
  const path = `${__dirname}/storage`;
  const date = new Date();
  const folder = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
  const folderPath = `${path}/${folder}/${type}`;
  mkdirp.sync(folderPath);
  let id = '';
  let videoPath = '';
  do {
    id = generateId();
    videoPath = `${folderPath}/${id}`;
  } while(fs.existsSync(videoPath));
  const result = { pathAbsolute: videoPath, pathRelative: `/${folder}/${type}/${id}` };
  return result;
};