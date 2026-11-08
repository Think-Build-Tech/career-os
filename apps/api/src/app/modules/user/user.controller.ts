import { Request, Response } from "express";
import { UserService } from "./services";

const userService = new UserService();

export async function getAllUsers(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const users = await userService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }

    const user = await userService.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.email || !data.first_name) {
      return res.status(400).json({
        success: false,
        message: "email and first_name are required",
      });
    }

    const user = await userService.create(data);
    return res.status(201).json({
      success: true,
      user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }

    const user = await userService.updateById(id, data);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }

    await userService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

