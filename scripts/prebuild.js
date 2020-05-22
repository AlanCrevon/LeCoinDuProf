#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ejs = require('ejs');

const environmentFilesDirectory = path.join(__dirname, '../src/environments');
const targetEnvironmentTemplateFileName = 'environment.prod.ts.template';
const targetEnvironmentFileName = 'environment.prod.ts';

const defaultEnvValues = {
  // Note : This key is invalidated
  GOOGLE_MAP_API_KEY_DEV: 'AIzaSyDtELC4i2mXzBeUI6yisMX8iH_a-dMUKIo'
};

// Load template file
const environmentTemplate = fs.readFileSync(path.join(environmentFilesDirectory, targetEnvironmentTemplateFileName), {
  encoding: 'utf-8'
});

// Generate output data
const output = ejs.render(environmentTemplate, Object.assign({}, defaultEnvValues, process.env));
// Write environment file
fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironmentFileName), output);

process.exit(0);
