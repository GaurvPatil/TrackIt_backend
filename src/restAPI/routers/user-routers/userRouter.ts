import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { userValidatorsSchema } from "../../schema/user-validation-schema/userSchema";
import { createUserController } from "../../controllers/user-controllers/createUser";
import { checkFirstSuperAdmin } from "../../../middlewares/checkFirstSuperAdmin";

const userRouter = Router();

userRouter.post(
  "/register",
  checkFirstSuperAdmin, // Middleware to check if the first super admin is being created
  validateRequest(userValidatorsSchema), // Middleware for validation
  createUserController // Controller for user creation
);


export default userRouter;