import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions(event, context) {
  const now = new Date();
  var params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndingAt",
    KeyConditionExpression: "#status = :status and endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await dynamodb.query(params).promise();
  return result.Items;
}
