import expressApp from "../express-server-connection/expressApp";
import { API_URL } from "../utils/constants/constants";
import dotenv from "dotenv";
dotenv.config();
import { Express } from "express";

const monitorServer = async (app: Express) => {
  const interval =
    parseInt(
      process.env.SERVER_CONNECTION_MONITORING_INTERVAL_MS as string,
      10
    ) || 30 * 60 * 1000; // 30 minutes default

  setInterval(async () => {
    try {
      console.log("Checking server health...");

      const restAPiresponse = await fetch(`${API_URL}/health`);
      if (restAPiresponse.status !== 200) {
        throw new Error(" Express Server health check failed.");
      }
      console.log(" Express Server is healthy.");
   
    } catch (error) {
      console.error(" Express Server health check failed. Restarting server...", error);
      try {
        await expressApp(app); // Restart server
      } catch (restartError) {
        console.error("Failed to connect to Express Server  after maximum retry attempts:", restartError);
      }
    }
  }, interval);
};

export { monitorServer };
