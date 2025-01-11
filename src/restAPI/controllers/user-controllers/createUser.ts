import { Request, Response } from "express";
import Students from "../../../models/user-model/studentsModel";
import SuperAdmin from "../../../models/user-model/superAdminModel";
import ProjectIncharge from "../../../models/user-model/projectInchargeModel";
import Admin from "../../../models/user-model/adminModel";

export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
      department_id,
      createdByRole,
      createdById,
    } = req.body;

    let newUser = null;

    switch (role) {
      case "superadmin":
        newUser = await SuperAdmin.create({
          name,
          email,
          password,
          role,
          createdByRole,
          createdById,
        });
        break;

      case "admin":
        newUser = await Admin.create({
          name,
          email,
          password,
          role,
          department_id,
          createdByRole,
          createdById,
        });
        break;

      case "projectincharge":
        newUser = await ProjectIncharge.create({
          name,
          email,
          password,
          role,
          department_id,
          createdByRole,
          createdById,
        });
        break;

      case "student":
        newUser = await Students.create({
          name,
          email,
          password,
          role,
          department_id,
          createdByRole,
          createdById,
        });
        break;

      default:
        res.status(400).json({
          status: false,
          message: "Invalid role",
          data: null,
        });
    }

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
