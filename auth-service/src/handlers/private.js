async function privateForTest(event, context) {
    return {
        statusCode: 200,
        body:JSON.stringify({
        claims: event.requestContext.authorizer.claims
      })}
}

export const handler = privateForTest;
