import expressApp from "../express-server-connection/expressApp";
import { API_URL } from "../utils/constants/constants";
import dotenv from "dotenv";
dotenv.config();


const monitorServer = async () => {
  const interval =
    parseInt(process.env.SERVER_CONNECTION_MONITORING_INTERVAL_MS as string, 10) ||
    30 * 60 * 1000; // 30 minutes default
 
  setInterval(async () => {
    try {
      console.log("Checking server health...");

      const response = await fetch(`${API_URL}/health`);
      if (response.status !== 200) {
        throw new Error("Server health check failed.");
      }

      console.log("Server is healthy.");
    } catch (error) {
      console.error("Server health check failed. Restarting server...", error);
      try {
        await expressApp(); // Restart server
      } catch (restartError) {
        console.error("Failed to restart the server:", restartError);
      }
    }
  }, interval);
};

export { monitorServer };
