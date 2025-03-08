import { Router } from "express";

const rootRouters = Router();

// Import routers
import userRouter from "../api-rest/routers/user-routers/userRouter";

// Mount user-related routes
rootRouters.use("/user", userRouter);
export default rootRouters;
