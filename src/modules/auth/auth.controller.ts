import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false, // jodi http -> false (development), jodi https -> true(Production)
      httpOnly: true, // cookier er moddhe j tokenta set korbo oita jate js or xss attack kora na jay
      sameSite: "lax", // "none" dile secure: true kore dite hobe + jkono domain e giye value ta set hoye jabe | "strick": kon website theke asche oita bole dite hobe + onno kono wesite theke ashle reject korbe | "lax": --> sameSite muloto CSRF attack pervent kore thake
      path: "/",
      domain: "localhost", // example.com (in Production)
    }); //* server theke browser e cookie set kortesi

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User login Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const generateToken = async (req: Request, res: Response) => {
  try {
    // console.log(req.cookies.refreshToken);

    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );

    res.status(200).json({
      success: true,
      message: "Access token Generated Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
