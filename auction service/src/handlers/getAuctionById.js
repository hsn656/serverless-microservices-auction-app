import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuction } from "../lib/getAuction";

const dynamodb = new AWS.DynamoDB.DocumentClient();



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
