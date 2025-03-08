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
      firstName,
      lastName,
      email,
      password,
      role,
      department_id,
      createdByRole,
      createdById,
      updatedByRole,
      updatedById,
    } = req.body;

    let newUser = null;

    switch (role) {
      case "superadmin":
        newUser = await SuperAdmin.create({
          firstName,
          lastName,
          email,
          password,
          role,
          createdByRole,
          createdById,
          updatedByRole,
          updatedById,
        });
        break;

      case "admin":
        newUser = await Admin.create({
          firstName,
          lastName,
          email,
          password,
          role,
          department_id,
          createdByRole,
          createdById,
          updatedByRole,
          updatedById,
        });
        break;

      case "projectincharge":
        newUser = await ProjectIncharge.create({
          firstName,
          lastName,
          email,
          password,
          role,
          department_id,
          createdByRole,
          createdById,
          updatedByRole,
          updatedById,
        });
        break;

      case "student":
        newUser = await Students.create({
          firstName,
          lastName,
          email,
          password,
          role,
          department_id,
          createdByRole,
          createdById,
          updatedByRole,
          updatedById,
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
