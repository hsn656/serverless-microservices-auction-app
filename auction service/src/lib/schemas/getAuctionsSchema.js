const schema = {
    properties: {
      query: {
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
      'query',
    ],
  };
  
  export default schema;