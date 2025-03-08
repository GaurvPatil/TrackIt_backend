import { gql } from "apollo-server-express";

const graphqlMonitoringTypedef = gql`
type getServerStatusResponse {
status: String!
statusCode: Int!
message: String!

}

  type Query {
    getServerStatusResponse: getServerStatusResponse!
  }
`;


export default graphqlMonitoringTypedef;