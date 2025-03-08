import { API_URL } from "../utils/constants/constants";
import dotenv from "dotenv";
dotenv.config();
import { Express } from "express";
import { graphqlConnection } from "../graphql-server-connection/graphqlConnection";

const monitorGraphql = async (app: Express) => {
  const interval =
    parseInt(
      process.env.GRAPHQL_CONNECTION_MONITORING_INTERVAL_MS as string,
      10
    ) || 30 * 60 * 1000; // 30 minutes default

  setInterval(async () => {
    try {
      console.log("Checking GraphQL health...");
      const graphqlResponse = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "{ getServerStatusResponse { status message statusCode } }",
        }), // Query to check the server status
      });

      if (graphqlResponse.status !== 200) {
        throw new Error("GraphQL health check failed.");
      }
    } catch (error) {
      console.error("GraphQL health check failed. Restarting GraphQL...", error);
      try {
        await graphqlConnection(app); // Restart server
      } catch (restartError) {
        console.error("Failed to restart the GraphQL:", restartError);
      }
    }
  }, interval);
};

export { monitorGraphql };
