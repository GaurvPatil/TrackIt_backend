import express, { Request, Response } from "express";
import { connectDB, sequelize } from "./database-connection/databaseConnection";
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
  const PORT = process.env.PORT as string;
  // Start the server after successful database connection
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
  });
});
