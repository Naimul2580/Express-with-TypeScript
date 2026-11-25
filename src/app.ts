import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import fs from "fs";

import { userRouter } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const log = `\n Method : ${req.method} | URL : ${req.url} | Time: ${Date.now()} \n`;
  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });

  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root Route",
    author: "PH",
  });
});

export default app;
