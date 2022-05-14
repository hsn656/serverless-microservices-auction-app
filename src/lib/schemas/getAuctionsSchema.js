const schema = {
    properties: {
      queryStringParameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description:"status can only bo CLOSED or OPEN",
            enum: ['OPEN', 'CLOSED'],
            default: 'OPEN',
          },
        },
      },
    },
    required: [
      'queryStringParameters',
    ],
  };
  
  export default schema;