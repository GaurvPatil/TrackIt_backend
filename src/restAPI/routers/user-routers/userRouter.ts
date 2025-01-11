import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { userValidatorsSchema } from "../../schema/user-validation-schema/userSchema";
import { createUserController } from "../../controllers/user-controllers/createUser";

const userRouter = Router();

userRouter.post(
  "/register",
  validateRequest(userValidatorsSchema), // Middleware for validation
  createUserController // Controller for user creation
);


export default userRouter;