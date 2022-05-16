import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const cognito = new AWS.CognitoIdentityServiceProvider()

async function login(event, context) {
    const { email,password} = event.body
    const { user_pool_id,client_id} = process.env
    const params = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        UserPoolId: user_pool_id,
        ClientId: client_id,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      }
      try {
        const response = await cognito.adminInitiateAuth(params).promise();
        console.log(response)
        return {
          statusCode: 200,
          body:JSON.stringify({
          message: 'Success',
          token: response.AuthenticationResult.IdToken
        })}
      } catch (error) {
        if(error.code==="NotAuthorizedException")
            throw new createError.Forbidden("wrong email or password");
        else
            throw new createError.InternalServerError("something went wrong");
      }
      
}

export const handler = commonMiddleware(login);
