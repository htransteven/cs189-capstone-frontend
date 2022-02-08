// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set configs
AWS.config.update({
  "region": "us-west-2",
  "accessKeyId": process.env.NEXT_AWS_DYNAMO_ACCESS_KEY_ID,
  "secretAccessKey": process.env.NEXT_AWS_DYNAMO_SECRET_ACCESS_KEY
});

var cw = new AWS.CloudWatchLogs();

module.exports = () => {
  return cw
}