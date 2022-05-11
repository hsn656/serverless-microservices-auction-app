import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
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

export const handler = commonMiddleware(getAuction);
