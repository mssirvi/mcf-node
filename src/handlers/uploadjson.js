import { collectFullData } from '../lib/collectdata.js';
import AWS from 'aws-sdk';
import createError from 'http-errors';
const s3 = new AWS.S3();

async function uploadjsonToS3(key, body) {
  const result = await s3.upload({
    Bucket: 'mcfnode-bucket-dev',
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'application/json'
  }).promise();

  return result.Location;
}
async function uploadjson(event, context) {
  const jsonData = await collectFullData();
  let data = Buffer.from(JSON.stringify(jsonData));
  try {
    const jsonLocation = await uploadjsonToS3("mcfdata.json", data);
    console.log("File uploaded at location: ", jsonLocation);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError("Something went wrong while uploading json to s3");
  }
}
uploadjson();

export const handler = uploadjson;


