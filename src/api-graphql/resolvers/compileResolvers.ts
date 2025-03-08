import graphqlMonitoringResolver from "./graphql-monitoring-resolver/graphqlMonitoringResolver";


const compiledResolvers = {
  Query: {
    ...graphqlMonitoringResolver,
  }
};

export default compiledResolvers;