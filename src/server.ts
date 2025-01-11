import express, { Request, Response } from "express";
import { connectDB, sequelize } from "./database-connection/databaseConnection";
import rootRouter from "./compileRoutes";
import dotenv from "dotenv";
dotenv.config();

// create express application
const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Connect to the database and start the server
connectDB().then(() => {
  syncDatabse(); // Synchronize database
  const PORT = process.env.PORT as string;
  // Start the server after successful database connection
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
  });
  app.use("/api", rootRouter);
});

// Function to synchronize database
// Ensures all tables defined in your models exist in the database.
async function syncDatabse() {
  try {
    await sequelize.sync({ force: false }); // Use `force: true` only during development (drops and recreates tables)
  } catch (err) {
    console.log("failed to synchronize database:", err);
    process.exit(1); // Exit process if synchronization fails
  }
}
