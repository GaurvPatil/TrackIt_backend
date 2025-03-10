import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { ErrorHandler } from "../utils/helper/responseHandeling";

/**
 * Middleware to validate incoming requests using Joi schemas
 * @param schema - Joi validation schema
 */

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false }); //abortEarly: false ensures that all validation issues in req.body are reported back to the user in one go.
    if (error) {
      ErrorHandler.restApiErrorHandler(
        res,
        400,
        "error",
        "Validation error",
        null,
        error.details.map((err) => err.message.replace(/['"]/g, "")),
            );
    } else {
      next(); // Proceed to the next middleware/controller
    }
  };
};
