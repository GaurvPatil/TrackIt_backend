import { Request, Response, NextFunction } from "express";
import SuperAdmin from "../models/user-model/superAdminModel";

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
        req.body.createdById = 0;
        req.body.createdByRole = "system";
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
