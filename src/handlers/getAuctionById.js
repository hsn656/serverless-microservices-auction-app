import AWS from "aws-sdk";
import middy from "@middy/core";
import httperrorhandler from "@middy/http-error-handler";
import httpeventnormalizer from "@middy/http-event-normalizer";
import httpjsonbodyparser from "@middy/http-json-body-parser";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(event, context) {
  let auction;
  const { id } = event.pathParameters;

  var params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await dynamodb.get(params).promise();
    auction = result.Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(getAuctionById).use([
  httpjsonbodyparser(),
  httperrorhandler(),
  httpeventnormalizer(),
]);
