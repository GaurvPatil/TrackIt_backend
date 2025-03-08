interface serverHealthResponse {
  message: string;
  status: string;
  statusCode: number;
  
}

const graphqlMonitoringResolver = {
  getServerStatusResponse: async (): Promise<serverHealthResponse> => {
    return {
      message: "GraphQL Server is running smoothly",
      status: "OK",
      statusCode: 200,
     
    }; // Just a simple response for monitoring
  },
};

export default graphqlMonitoringResolver;
