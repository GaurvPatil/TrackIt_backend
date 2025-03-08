import {
  connectDB,
  sequelize,
} from "../database-connection/databaseConnection";
import dotenv from "dotenv";
import { ErrorHandler } from "../utils/helper/responseHandeling";
dotenv.config();
const interval =
  parseInt(process.env.DB_CONNECTION_MONITORING_INTERVAL_MS as string, 10) ||
  1800000; // 30 minutes
const monitorDBConnection = async () => {
  setInterval(async () => {
    try {
      console.log("Checking Database health...");
      await sequelize.authenticate();
      console.log("Database connection is healthy.");
      // sendMailtoOwner
    } catch (error: any) {
      console.error(
        "Database connection health check failed. Restarting Database connection...",
        error
      );

      try {
        await connectDB();
      } catch (restartError) {
        console.error(
          "Failed to reconnect to the database after maximum retry attempts.",
          restartError
        );
      }
    }
  }, interval);
};

export { monitorDBConnection };
