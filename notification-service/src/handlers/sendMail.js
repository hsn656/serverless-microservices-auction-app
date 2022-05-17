import AWS from 'aws-sdk';

const ses = new AWS.SES();

async function sendMail(event, context) {
  const params = {
    Source: 'hassan.mhmd656@gmail.com',
    Destination: {
      ToAddresses: ['dx201038@yahoo.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hello hsn!',
        },
      },
      Subject: {
        Data: 'Test Mail',
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendMail;