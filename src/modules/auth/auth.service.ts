import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
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
  };
  const accessToken = jwt.sign(jwtPayload, config.sceret_key, {
    expiresIn: "1d",
  });

  delete user.rows[0].password;
  return { accessToken, user: user.rows[0] };
};

export const authService = {
  loginUserIntoDB,
};
