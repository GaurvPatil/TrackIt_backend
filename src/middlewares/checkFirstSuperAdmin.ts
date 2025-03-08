import { Request, Response, NextFunction } from "express";
import SuperAdmin from "../models/user-model/superAdminModel";

// Function to generate a UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const checkFirstSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body.role === "superadmin") {
      //check if any superAdmin exist in database
      const superAdminCount = await SuperAdmin.count();
      if (superAdminCount === 0) {
        //  First super admin : createdByRole and createdById are not required
        req.body.createdById = generateUUID();
        req.body.createdByRole = "system";
        req.body.updatedById = generateUUID();
        req.body.updatedByRole = "system";
      }
    }

    next(); // proceed to the next middleware/controller
  } catch (err) {
    console.error("Eror checking first super admin : ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
