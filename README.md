## Requirements
* Install and configure aws cli https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
* Install the serverless framework https://www.serverless.com/framework/docs/getting-started/
## Getting started

```
Clone this repo
npm install
```
# To create aws resources 
* sls deploy
* please note the endpoint from the output of the above command. This is our api endpoint for getjson.
# To upload json to AWS S3 from the xml api 
* npm run uploadjson
This will take a considerable amount of time to upload the json.

You are ready to go!
