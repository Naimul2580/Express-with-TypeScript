import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  //* eikhane "auth" k ekta -> "Higher Order Function" banano hoyeche
  return async (req: Request, res: Response, next: NextFunction) => {
    //   console.log(`This is Procted Route`);
    //   console.log(req.headers.authorization);

    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized access !",
        });
      }

      const decode = jwt.verify(token, config.sceret_key) as JwtPayload;
      //   console.log(decode);

      const user = await pool.query(
        `
    SELECT * FROM users
    WHERE email = $1
    `,
        [decode.email],
      );
      //   console.log(user.rows[0]);

      if (user.rowCount === 0) {
        return res.status(404).json({
          status: false,
          message: "User Not Found !",
        });
      }

      if (!user.rows[0].is_active) {
        return res.status(403).json({
          status: false,
          message: "Forbiden !",
        });
      }

      req.user = decode; //* req er moddhe user thake na , eke globally declare kora lage jeita "index.d.ts" file e  kora hoyeche
      // console.log(decode);

      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized access !",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
