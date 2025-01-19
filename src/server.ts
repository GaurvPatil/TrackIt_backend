import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./database-connection/databaseConnection";
import rootRouter from "./compileRoutes";
import { checkDBConnection } from "./middlewares/error-handeling/checkDBConnection";
import { monitorDBConnection } from "./middlewares/error-handeling/monitorDBConnection";
dotenv.config();

// Create Express application
const app = express();

// Initialize global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    await monitorDBConnection();

    const PORT = process.env.PORT || 5000;
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

    // Test route
    app.get("/", (req: Request, res: Response) => {
      res.send("API is running...");
    });

    // Mount routes
    app.use("/api", checkDBConnection, rootRouter);
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process if something goes wrong
  }
};

// Start the server
startServer();
