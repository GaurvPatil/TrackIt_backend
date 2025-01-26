import { Router } from "express";

const rootRouters = Router();

// Import routers
import userRouter from "./restAPI/routers/user-routers/userRouter";

// Mount user-related routes
rootRouters.use("/user", userRouter);
export default rootRouters;
