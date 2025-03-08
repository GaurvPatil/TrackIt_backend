import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database-connection/databaseConnection";
import { monitorDBConnection } from "./server-monitoring/monitorDBConnection";
import expressApp from "./express-server-connection/expressApp";
import { monitorServer } from "./server-monitoring/monitorServerConnection";
import { graphqlConnection } from "./graphql-server-connection/graphqlConnection";
import { monitorGraphql } from "./server-monitoring/monitorGraphqlConnection";
dotenv.config();

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    await monitorDBConnection();
    // Create Express application
    const app = express();
    await expressApp(app);
    await monitorServer(app);

    await graphqlConnection(app);
    await monitorGraphql(app);
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process if something goes wrong
  }
};

// Start the server
startServer();
