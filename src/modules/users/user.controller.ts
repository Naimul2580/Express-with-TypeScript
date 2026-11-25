import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User Created !!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    // console.log(result);

    const result = await userService.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      message: "Users Retrived !!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserFromDB(id as string);
    // console.log(result);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User does not Exist !!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Retrived !!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.updateUserFromDb(req.body, id as string);

    // console.log(result);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User does not Exist !!",
      });
    }

    res.status(201).json({
      success: true,
      message: "User Updated !!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUserFromDB(id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User does not Exist !!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Deleted !!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
