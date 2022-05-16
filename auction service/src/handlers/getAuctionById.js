import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuction(id) {
  let auction;
  var params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await dynamodb.get(params).promise();
    auction = result.Item;
    if (!auction) {
      throw new createError.NotFound();
    }
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return auction;
}

async function getAuctionById(event, context) {
  let auction;
  const { id } = event.pathParameters;

  auction = await getAuction(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuctionById);
