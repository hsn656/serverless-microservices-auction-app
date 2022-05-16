import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import validator from '@middy/validator';
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import createAuctionSchema from '../lib/schemas/createAuctionSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  const endingAt = new Date();
  endingAt.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endingAt.toISOString(),
    highestBid: {
      amount: 0,
    },
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

export const handler = commonMiddleware(createAuction)
  .use(validator({ 
    inputSchema: createAuctionSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  }));