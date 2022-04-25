import AWS from 'aws-sdk';
import createError from 'http-errors';

const s3 = new AWS.S3();

async function getObject(bucket, key) {
    try {
        const query = 'SELECT * FROM s3object[*].travelers[*] r;';

    const params = {
      Bucket: bucket,
      Key: key,
      ExpressionType: 'SQL',
      Expression: query,
      InputSerialization: {
        JSON: {
          Type: 'DOCUMENT',
        }
      },
      OutputSerialization: {
        JSON: {
          RecordDelimiter: ','
        }
      }
    }

    const data = await getDataUsingS3Select(params);
    return data;
    } catch (e) {
        throw new createError.InternalServerError(`Could not retrieve file from S3: ${e.message}`)
    }
}

async function getDataUsingS3Select(params) {
    return new Promise((resolve, reject) => {
        s3.selectObjectContent(params, (err, data) => {
        if (err) { reject(err); }
  
        if (!data) {
          reject('Empty data object');
        }
        const records = []

        data.Payload.on('data', (event) => {
          if (event.Records) {
            records.push(event.Records.Payload);
          }
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          let travellersdata = Buffer.concat(records).toString('utf8');
  
          travellersdata = travellersdata.replace(/\,$/, '');
  
          // Add into JSON 'array'
          travellersdata = `[${travellersdata}]`;
  
          try {
            const travellers = JSON.parse(travellersdata);
            resolve(travellers);
          } catch (e) {
            reject(new Error(`Unable to convert S3 data to JSON object. S3 Select Query: ${params.Expression}`));
          }
        });
      });
    })
  }
async function getjson(event, context) {
    const myObject = await getObject(process.env.MCFNODE_BUCKET_NAME, 'mcfdata.json');
    return {
        statusCode: 200,
        body: JSON.stringify({ myObject }),
    };
}

export const handler = getjson;