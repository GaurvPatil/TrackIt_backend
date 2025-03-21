import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();

interface ErrorResponse {
  statusCode: number;
  status: string;
  message: string;
  data: any;
  error?: any;
}

export interface SuccessResponse {
  statusCode: number;
  status: string;
  message: string;
  data: any;
}

export class ErrorHandler {
  public static restApiErrorHandler(
    res: Response,
    statusCode: number = 500,
    status: string = "error",
    message: string = "An error occurred",
    data: any = null,
    error?: any
  ) {
    const response: ErrorResponse = {
      statusCode: statusCode,
      status: status,
      message: message,
      data: data,
    };

    if (process.env.NODE_ENV !== "production") {
      response["error"] =  error;
    }

    res.status(statusCode).json(response);
  }

  public static standardErrorHandler(
    statusCode: number = 500,
    status: string = "Error",
    message: string = "An error occurred",
    data: any = null,
    error?: any
  ): ErrorResponse {
    const response: ErrorResponse = {
      statusCode: statusCode,
      status: status,
      message: message,
      data: data,
    };

    if (process.env.NODE_ENV !== "production") {
      response["error"] =  error;
    }

    return response;
  }
}

export class SuccessHandler {
  public static restApiSuccessHandler(
    res: Response,
    statusCode: number,
    status: string,
    message: string,
    data: any
  ) {
    res.status(statusCode).json({
      status: status,
      message: message,
      data: data,
    });
  }

  public static standardSuccessHandler(
    statusCode: number = 200,
    status: string = "ok",
    message: string = "Success",
    data: any = null
  ): SuccessResponse {
    return {
      statusCode: statusCode,
      status: status,
      message: message,
      data: data,
    };
  }
}
