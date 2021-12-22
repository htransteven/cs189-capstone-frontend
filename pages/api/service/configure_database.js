// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set configs
AWS.config.update({
  "region": "us-west-2",
  "accessKeyId": process.env.NEXT_AWS_DYNAMO_ACCESS_KEY_ID,
  "secretAccessKey": process.env.NEXT_AWS_DYNAMO_SECRET_ACCESS_KEY
});
let docClient=new AWS.DynamoDB.DocumentClient();
// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

module.exports = () => {
  return ddb
}