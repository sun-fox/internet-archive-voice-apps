const axios = require('axios');
const debug = require(`debug`)(`ia:uploader:agent:debug`);
const error = require(`debug`)(`ia:uploader:agent:error`);
const util = require(`util`);
const { exec } = require('child-process-promise');
const {prepareAgentToFetchFromDF} = require('../utils/prepare_agent');

function fetchAgentFromDF () {
  return getAccessToken()
    .then(accesstoken => {
      return axios('https://dialogflow.googleapis.com/v2/projects/music-a88c1/agent:export?access_token=' + accesstoken, {method: `POST`});
    })
    .then(res => res.data)
    .then(data => {
      return prepareAgentToFetchFromDF(data.response.agentContent, '../../agent/', 'agent.zip');
    })
    .catch(e => {
      error(`Get error in posting entity to DF, error: ${JSON.stringify(e)}`);
      return Promise.reject(e);
    });
}

function getAccessToken () {
  debug('getting access token');
  return exec('gcloud auth print-access-token')
    .then(values => {
      var stdout = values.stdout;
      var stderr = values.stderr;
      if (stdout) {
        var filteredstdout = stdout.replace(/\n$/, '');
        debug(util.inspect(filteredstdout, false, null));
        return Promise.resolve(filteredstdout);
      } else if (stderr) {
        error(stderr);
        return Promise.reject(new Error('ERROR: ' + stderr));
      } else {
        error('Having trouble with GCloud execution');
        return Promise.reject(new Error('ERROR: Having trouble with GCloud execution'));
      }
    });
}

// convert image to base64 encoded string
// var base64str = base64_encode('kitten.jpg');
// debug(base64str);
// convert base64 string back to image
// base64_decode(base64str, 'copy.jpg');

module.exports = {
  fetchAgentFromDF,
};
