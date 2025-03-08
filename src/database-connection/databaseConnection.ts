import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { CircuitBreaker } from "../middlewares/error-handeling/circuitBreaker";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT as string, 10),
    logging: false,
  }
);

const threshold =
  parseInt(process.env.DB_CONNECTION_THRESHOLD as string, 10) || 3;

const timeout =
  parseInt(process.env.DB_CONNECTION_TIMEOUT_MS as string, 10) || 60 * 1000;
const dbCircuitBreaker = new CircuitBreaker(threshold, timeout);
const circuiteBreakerStates = dbCircuitBreaker.getState();
let isConnecting = false;

const connectDB = async (retryCount = 0) => {
  let tryingToReconnectCount = retryCount;
  // Prevent overlapping calls unless it's an internal retry
  if (isConnecting && tryingToReconnectCount === 0) {
    console.log("A DBConnection  attempt is already in progress. Skipping...");
    return;
  }

  try {
    isConnecting = true; // Set lock for external calls
    tryingToReconnectCount += 1; // Increment retry count
    // Check if the circuit breaker allows attempts
    if (!dbCircuitBreaker.shouldAttemptConnection()) {
      console.log("Circuit breaker is OPEN. Skipping DBConnection attempt.");
      return;
    }

    await sequelize.authenticate(); // Attempt to authenticate with the database
    await syncDatabase(); // Synchronize the database
    console.log("Connected to the database successfully.");
    dbCircuitBreaker.handleSuccess(); // Reset circuit breaker on success
    isConnecting = false; // Release lock
  } catch (error: any) {
    console.error("Failed to connect to the database:");

    dbCircuitBreaker.handleFailure(); // Increment failure count and  open the circuit
    console.log(
      `Retry attempt (${circuiteBreakerStates.failures}/${circuiteBreakerStates.threshold})...`
    );

    // Check if the circuit breaker is now OPEN
    if (circuiteBreakerStates.state === "OPEN") {
      console.log(
        "DBConnection Circuit breaker is now OPEN. Retry will happen after:" +
          circuiteBreakerStates.timeout +
          "ms"
      );

      // Stop retries after exceeding the maximum failure threshold
      if (circuiteBreakerStates.failures >= circuiteBreakerStates.threshold) {
        console.log(
          "Max retry limit reached. Stopping retries and resetting DBConnection circuit breaker."
        );
        dbCircuitBreaker.handleSuccess(); // Reset circuit breaker to CLOSED to avoid further retries
        isConnecting = false; // Release lock
        throw new Error(error);
      }

      // Schedule a retry after the timeout period
      setTimeout(async () => {
        await connectDB(tryingToReconnectCount); // Retry connecting to the database
      }, circuiteBreakerStates.timeout);
    }
  } finally {
    isConnecting = false; // Release lock
  }
};

// Function to synchronize database
async function syncDatabase() {
  try {
    await sequelize.sync({ force: false }); // Avoid using `force: true` in production
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
}

export { sequelize, connectDB };
