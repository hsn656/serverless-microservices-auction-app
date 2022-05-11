import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middy from "@middy/core";
import httperrorhandler from "@middy/http-error-handler";
import httpeventnormalizer from "@middy/http-event-normalizer";
import httpjsonbodyparser from "@middy/http-json-body-parser";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction).use([
  httpjsonbodyparser(),
  httperrorhandler(),
  httpeventnormalizer(),
]);