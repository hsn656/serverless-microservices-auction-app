import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from '@middy/validator';
import placeBidSchema from '../lib/schemas/placeBidSchema';
import { getAuction } from "../lib/getAuction";


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.path;
  const { amount } = event.body;
  const {email:bidderEmail}=event.cognitoPoolClaims;

  const auction = await getAuction(id);
    
  if (auction.status !== "OPEN") {
    throw new createError.Forbidden("you can't bid on closed auction");
  }

  if(auction.highestBid.bidder === bidderEmail){
    throw new createError.Forbidden("you already the highest bidder")
  }

  if(auction.seller === bidderEmail){
    throw new createError.Forbidden("you can't bid on your auction")
  }

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `your amount must be bigger than ${auction.highestBid.amount}`
    );
  }
  var params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": bidderEmail
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
    auction:updatedAuction
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({ 
    inputSchema: placeBidSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  }));