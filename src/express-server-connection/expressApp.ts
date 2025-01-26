import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { CircuitBreaker } from "../middlewares/error-handeling/circuitBreaker";
import { checkDBConnection } from "../middlewares/checkDBConnection";
import rootRouters from "../compileRoutes";
import { API_URL } from "../utils/constants/constants";

dotenv.config();

const threshold =
  parseInt(process.env.SERVER_CONNECTION_THRESHOLD as string, 10) || 3;
const timeout =
  parseInt(process.env.SERVER_CONNECTION_TIMEOUT_MS as string, 10) || 60 * 1000;
const serverCircuitBreaker = new CircuitBreaker(threshold, timeout);
const serverCircuitBresakerStates = serverCircuitBreaker.getState();
let isConnecting = false;

const expressApp = async (retryCount = 0) => {
  let tryingToReconnectCount = retryCount;
  // Prevent overlapping calls unless it's an internal retry

  if (isConnecting && tryingToReconnectCount === 0) {
    console.log("A DBConnection  attempt is already in progress. Skipping...");
    return;
  }

  try {
    isConnecting = true;
    tryingToReconnectCount += 1;
    if (!serverCircuitBreaker.shouldAttemptConnection()) {
      console.log(
        "Circuit breaker is OPEN. Skipping server connection attempt."
      );
      return;
    }

    // Attempt to create the server
    const app = express();
    // Initialize global middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (process.env.NODE_ENV === "development") {
      const morgan = require("morgan");
      app.use(morgan("dev"));
    }
    const PORT = process.env.PORT || 5000;
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at ${API_URL}:${PORT}`);
    });

    // Test route
    app.get("/health", (req: Request, res: Response) => {
      res.status(200).send("Server is running...");
    });

    // Mount routes
    app.use("/api", checkDBConnection, rootRouters);
    console.log("Connected to server successfully.");
    serverCircuitBreaker.handleSuccess(); // Reset the circuit breaker on success
    isConnecting = false; // Release lock
  } catch (error) {
    serverCircuitBreaker.handleFailure();
    console.error(
      `Retry attempt (${serverCircuitBresakerStates.failures}/${serverCircuitBresakerStates.threshold})...`
    );
    if (serverCircuitBresakerStates.state === "OPEN") {
      console.log(
        "DBConnection Circuit breaker is now OPEN. Retry will happen after:" +
          serverCircuitBresakerStates.timeout +
          "ms"
      );

      if (
        serverCircuitBresakerStates.failures >=
        serverCircuitBresakerStates.threshold
      ) {
        console.log(
          "Max retry limit reached. Stopping retries and resetting DBConnection circuit breaker."
        );
        serverCircuitBreaker.handleSuccess();
        isConnecting = false; // Release lock
        return; // Exit without retrying
      }
    }
    // Schedule a retry after the timeout period
    setTimeout(async () => {
      await expressApp(tryingToReconnectCount); // Retry connecting to the database
    }, serverCircuitBresakerStates.timeout);
  } finally {
    isConnecting = false; // Release lock
  }
};

export default expressApp;
