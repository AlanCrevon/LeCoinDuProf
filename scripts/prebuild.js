#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const replace = require('replace-in-file');

const PRODUCTION_BRANCH = 'master';
const STAGING_BRANCH = 'develop';

const branch = process.argv[2];
const tag = process.argv[3];

console.log('Modifying configuration files to suit environement...');
if (branch === PRODUCTION_BRANCH) {
  console.log('Configuring for PRODUCTION...');
} else if (branch == STAGING_BRANCH) {
  console.log('Configuring for STAGING...');
}

/**
 * Environment variables
 */
// Configuration files
console.log('Building environment files...');
const environmentFilesDirectory = path.join(__dirname, '../src/environments');
let targetEnvironmentTemplateFileName = 'environment.staging.ts.template';
let targetEnvironementFileName = 'environment.staging.ts';
if (branch == PRODUCTION_BRANCH) {
  targetEnvironmentTemplateFileName = 'environment.prod.ts.template';
  targetEnvironementFileName = 'environment.prod.ts';
}

const defaultEnvValues = {
  // Note : This key is invalidated
  GOOGLE_MAP_API_KEY_DEV: 'AIzaSyDtELC4i2mXzBeUI6yisMX8iH_a-dMUKIo'
};

// Load template files
const environmentTemplate = fs.readFileSync(path.join(environmentFilesDirectory, targetEnvironmentTemplateFileName), {
  encoding: 'utf-8'
});
// Generate output data
const environmentOutput = ejs.render(environmentTemplate, Object.assign({}, defaultEnvValues, process.env));

// Write environment file
fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironementFileName), environmentOutput);
console.log('OK');

/**
 * Firebase messaging service worker
 */
console.log('Building firebase messaging service worker...');
const serviceWorkerFileDirectory = path.join(__dirname, '../src');
let serviceWorkerConfigurationFile = 'firebase-messaging-sw-staging.js';
if (branch == PRODUCTION_BRANCH) {
  serviceWorkerConfigurationFile = 'firebase-messaging-sw-production.js';
}
const serviceWorkerOutputFile = 'firebase-messaging-sw.js';
fs.copyFileSync(
  path.join(serviceWorkerFileDirectory, serviceWorkerConfigurationFile),
  path.join(serviceWorkerFileDirectory, serviceWorkerOutputFile)
);
console.log('OK');

/**
 * Manifest
 */
console.log('Building manifest.json...');
const manifestFileDirectory = path.join(__dirname, '../src');
let manifestConfigurationFile = 'manifest-staging.json';
if (branch == PRODUCTION_BRANCH) {
  manifestConfigurationFile = 'manifest-production.json';
}
const manifestOutputFile = 'manifest.json';
fs.copyFileSync(
  path.join(manifestFileDirectory, manifestConfigurationFile),
  path.join(manifestFileDirectory, manifestOutputFile)
);
console.log('OK');

/**
 * OG Metas in index.html
 */
console.log('Building OpenGraph meta...');
let options = {
  files: path.join(__dirname, '../src/index.html'),
  from: /https:\/\/lecoinduprof.com/g,
  to: 'https://dev.lecoinduprof.com'
};
if (branch == PRODUCTION_BRANCH) {
  options = {
    files: path.join(__dirname, '../src/index.html'),
    from: /https:\/\/dev.lecoinduprof.com/g,
    to: 'https://lecoinduprof.com'
  };
}
const results = replace.sync(options);
console.log(results);
console.log('OK');

process.exit(0);
