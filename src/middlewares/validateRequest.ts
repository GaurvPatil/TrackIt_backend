import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

/**
 * Middleware to validate incoming requests using Joi schemas
 * @param schema - Joi validation schema
 */

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false }); //abortEarly: false ensures that all validation issues in req.body are reported back to the user in one go.
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message.replace(/['"]/g, "")),
        data : null
      });
    } else {
      next(); // Proceed to the next middleware/controller
    }
  };
};

