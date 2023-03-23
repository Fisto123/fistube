import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./router/auth.js";
import userRouter from "./router/user.js";
import videoRouter from "./router/video.js";
import commentRouter from "./router/comment.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/comment", commentRouter);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).send({
    success: false,
    status,
    message,
  });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.port, () =>
      console.log(`Server running on port ${process.env.port}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));
