import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const cognito = new AWS.CognitoIdentityServiceProvider()

async function signup(event, context) {
    const {email,password}= event.body;
    const {user_pool_id} = process.env;

    const params = {
        UserPoolId: user_pool_id,
        Username: email,
        UserAttributes: [{
            Name: 'email',
            Value: email
          },
          {
            Name: 'email_verified',
            Value: 'true'
          }
        ],
        MessageAction: 'SUPPRESS'
      }
      try {
        const response = await cognito.adminCreateUser(params).promise();
        if (response.User) {
          const paramsForSetPass = {
            Password: password,
            UserPoolId: user_pool_id,
            Username: email,
            Permanent: true
          };
          await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
      } catch (error) {
        throw new createError.InternalServerError(error);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'User registration successful'
          }),
      };
}

export const handler = commonMiddleware(signup);

