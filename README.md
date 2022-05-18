# serverless-microservices-auction-app
Auction app where you login create your auction upload its image, then you can view all available auction.
people can bid on you auctions so as you can, after 1 hour of your auction creation, your auction will be ended for the highest bidder
then both you and bidder will recieve email informing you with results.
  
##here are Amazon Web Serevices used:
- Lambda Function
- API Gateway
- S3
- SQS
- SES
- AWS Cognito
- Dynamo DB

## What's included
* [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started
```
git clone git@github.com:hsn656/serverless-microservices-auction-app.git
cd serverless-microservices-auction-app/

cd auth-service/
npm install
sls deploy --verbose

cd notification-service/
npm install
sls deploy --verbose

cd auction\ service/
npm install
sls deploy --verbose

```

You are ready to go!
