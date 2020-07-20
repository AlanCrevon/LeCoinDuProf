#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Configuration files
const environmentFilesDirectory = path.join(__dirname, '../src/environments');
// Staging
const targetStagingTemplateFileName = 'environment.staging.ts.template';
const targetStagingFileName = 'environment.staging.ts';
// Production
const targetProductionTemplateFileName = 'environment.prod.ts.template';
const targetProductionFileName = 'environment.prod.ts';

const defaultEnvValues = {
  // Note : This key is invalidated
  GOOGLE_MAP_API_KEY_DEV: 'AIzaSyDtELC4i2mXzBeUI6yisMX8iH_a-dMUKIo'
};

// Load template files
const productionTemplate = fs.readFileSync(path.join(environmentFilesDirectory, targetProductionTemplateFileName), {
  encoding: 'utf-8'
});
const stagingTemplate = fs.readFileSync(path.join(environmentFilesDirectory, targetStagingTemplateFileName), {
  encoding: 'utf-8'
});

// Generate output data
const productionOutput = ejs.render(productionTemplate, Object.assign({}, defaultEnvValues, process.env));
const stagingOutput = ejs.render(stagingTemplate, Object.assign({}, defaultEnvValues, process.env));

// Write environment file
fs.writeFileSync(path.join(environmentFilesDirectory, targetProductionFileName), productionOutput);
fs.writeFileSync(path.join(environmentFilesDirectory, targetStagingFileName), stagingOutput);

process.exit(0);
