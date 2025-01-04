import express, { Request, Response } from "express";
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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Connect to the database and start the server
