import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRouter } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import cors from "cors";

const app: Application = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

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

// Global Error handler
app.use(globalErrorHandler);

export default app;
