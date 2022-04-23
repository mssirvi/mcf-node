async function uploadjson(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'testing' }),
  };
}

export const handler = uploadjson;


