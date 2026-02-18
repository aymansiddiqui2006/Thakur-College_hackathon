import express from "express";
import userRouter from "./router/userRoute.js";

const app = express();


app.use("/api/v1/users", userRouter);

export default app;
