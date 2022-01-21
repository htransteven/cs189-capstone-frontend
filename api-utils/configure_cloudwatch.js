// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var cw = new AWS.CloudWatchLogs();

module.exports = () => {
  return cw
}