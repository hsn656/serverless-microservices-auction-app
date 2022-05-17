import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import validator from '@middy/validator';
import createError from "http-errors";
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';
 

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  const {status}= event.query;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };
  try {
    const result = await dynamodb.query(params).promise();
    auctions = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    auctions
  };
}

export const handler = commonMiddleware(getAuctions)
.use(
  validator({
    inputSchema: getAuctionsSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);