import { Router } from "express";

const rootRouter = Router();

// Import routers
import userRouter from "./restAPI/routers/user-routers/userRouter";

// Mount user-related routes
rootRouter.use("/user", userRouter);
export default rootRouter;
