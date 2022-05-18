import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export async function uploadPictureToS3(key, body,contentType) {
  const picExtension= contentType.split("/")[1];

  const result = await s3.upload({
    Bucket: process.env.AUCTIONS_BUCKET_NAME,
    Key: `${key}.${picExtension}`,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: contentType,
  }).promise();

  return result.Location;
}