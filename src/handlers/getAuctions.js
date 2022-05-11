import AWS from "aws-sdk";
import middy from "@middy/core";
import httperrorhandler from "@middy/http-error-handler";
import httpeventnormalizer from "@middy/http-event-normalizer";
import httpjsonbodyparser from "@middy/http-json-body-parser";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auctions;

  var params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    auctions = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuction).use([
  httpjsonbodyparser(),
  httperrorhandler(),
  httpeventnormalizer(),
]);
