import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import dotenv from "dotenv";
import compiledResolvers from "../api-graphql/resolvers/compileResolvers";
import compiledTypeDefs from "../api-graphql/typedefs/compileTypeDefs";
import { CircuitBreaker } from "../middlewares/error-handeling/circuitBreaker";

dotenv.config();

const threshold =
  parseInt(process.env.GRAPHQL_CONNECTION_THRESHOLD as string, 10) || 3;
const timeout =
  parseInt(process.env.GRAPHQL_CONNECTION_TIMEOUT_MS as string, 10) || 60 * 1000;
const serverCircuitBreaker = new CircuitBreaker(threshold, timeout);
const graphqlCircuitBresakerStates = serverCircuitBreaker.getState();
let isConnecting = false;

export const graphqlConnection = async (
  app: Express,
  retryCount = 0
): Promise<void> => {
  let tryingToReconnectCount = retryCount;
  // Prevent overlapping calls unless it's an internal retry
  if (isConnecting && tryingToReconnectCount === 0) {
    console.log(
      "A graphql connection  attempt is already in progress. Skipping..."
    );
    return;
  }
  try {
    isConnecting = true;
    tryingToReconnectCount += 1;
    if (!serverCircuitBreaker.shouldAttemptConnection()) {
      console.log(
        "Circuit breaker is OPEN. Skipping graphql connection attempt."
      );
      return;
    }

    const server = new ApolloServer({
      typeDefs: [...compiledTypeDefs],
      resolvers: { ...compiledResolvers },
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    console.log("Connected to the graphql server successfully.");
    serverCircuitBreaker.handleSuccess(); // Reset the circuit breaker on success
    isConnecting = false; // Release lock
  } catch (error) {
    serverCircuitBreaker.handleFailure();
    console.error(
      `Retry attempt (${graphqlCircuitBresakerStates.failures}/${graphqlCircuitBresakerStates.threshold})...`
    );
    if (graphqlCircuitBresakerStates.state === "OPEN") {
      console.log(
        "graphql connection Circuit breaker is now OPEN. Retry will happen after:" +
          graphqlCircuitBresakerStates.timeout +
          "ms"
      );

      if (
        graphqlCircuitBresakerStates.failures >=
        graphqlCircuitBresakerStates.threshold
      ) {
        console.log(
          "Max retry limit reached. Stopping retries and resetting graphql connection circuit breaker."
        );
        serverCircuitBreaker.handleSuccess();
        isConnecting = false; // Release lock
        return; // Exit without retrying
      }
    }
    // Schedule a retry after the timeout period
    setTimeout(async () => {
      await graphqlConnection(app, tryingToReconnectCount); // Retry connecting to the database
    }, graphqlCircuitBresakerStates.timeout);
  } finally {
    isConnecting = false; // Release lock
  }
};
