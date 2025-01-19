import { Request, Response, NextFunction } from "express";
import { sequelize } from "../../database-connection/databaseConnection";

export const checkDBConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sequelize.authenticate(); // Check if the database connection is working
    console.error("Database connection is working fine.");
    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error("Database connection lost:", error);
    res.status(503).json({
      status: false,
      message: "Service unavailable. Please try again later.",
      data: null,
    });
  }
};


