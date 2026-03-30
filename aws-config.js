// aws-config.js
const AWS = require('aws-sdk');

// TODO: Move these to environment variables before launch!
const s3 = new AWS.S3({
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
});

module.exports = s3;
