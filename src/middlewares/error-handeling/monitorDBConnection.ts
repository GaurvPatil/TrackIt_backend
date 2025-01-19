import {
  connectDB,
  sequelize,
} from "../../database-connection/databaseConnection";
import dotenv from "dotenv";
dotenv.config();
const interval =
  parseInt(process.env.DB_CONNECTION_MONITOR_INTERVAL as string, 10) || 1800000; // 30 minutes
const monitorDBConnection = async () => {
  setInterval(async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection is healthy.");
      // sendMailtoOwner
    } catch (error) {
      console.error(
        "Database connection lost. Attempting to reconnect to the database. Error details:",
        error
      );
      console.log("monitorDBConnection");
      await connectDB();
    }
  }, interval);
};

export { monitorDBConnection };
