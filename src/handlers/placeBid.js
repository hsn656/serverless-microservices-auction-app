import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuction } from "./getAuctionById";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuction(id);

  if (auction.status !== "OPEN") {
    throw new createError.Forbidden("you can't bid on closed auction");
  }

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `your amount must be bigger than ${auction.highestBid.amount}`
    );
  }
  var params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(getAuctionById);
