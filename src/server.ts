import dotenv from "dotenv";
import { connectDB } from "./database-connection/databaseConnection";
import { monitorDBConnection } from "./server-monitoring/monitorDBConnection";
import expressApp from "./express-server-connection/expressApp";
import { monitorServer } from "./server-monitoring/monitorServerConnection";
dotenv.config();

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    await monitorDBConnection();
    // Create Express application
    await expressApp();
    await monitorServer();
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process if something goes wrong
  }
};

// Start the server
startServer();
