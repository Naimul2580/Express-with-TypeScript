import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: IAuth) => {
  // check if user exists
  // check if password match
  // check the user status
  // If pass all then generate jwt token

  const { email, password } = payload;
  //   console.log("A. querying user for:", email);

  const user = await pool.query(
    `
        SELECT * FROM users WHERE
        email = $1
        `,
    [email],
  );
  //   console.log("B. query done, rowCount:", user.rowCount);
  if (user.rowCount === 0) {
    throw new Error("Invalid credentials !!");
  }

  const matchPasword = await bcrypt.compare(password, user.rows[0].password);
  //   console.log("C. password matched:", matchPasword);
  if (!matchPasword) {
    throw new Error("Invalid credentials !!");
  }

  if (!user.rows[0].is_active) {
    throw new Error("Access Denied !!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
  const accessToken = jwt.sign(jwtPayload, config.sceret_key, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_sceret_key, {
    expiresIn: "10d",
  });

  delete user.rows[0].password;
  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access !");
  }

  const decode = jwt.verify(token, config.refresh_sceret_key) as JwtPayload;
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
    throw new Error("User Not Found !");
  }

  if (!user.rows[0].is_active) {
    throw new Error("Forbiden !");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
  const accessToken = jwt.sign(jwtPayload, config.sceret_key, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
