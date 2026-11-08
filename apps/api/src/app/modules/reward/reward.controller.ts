import { Request, Response } from "express";
import { RewardTransactionService } from "./services";

const rewardService = new RewardTransactionService();

export async function getAllTransactions(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const transactions = await rewardService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getTransactionById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide transaction ID",
      });
    }

    const transaction = await rewardService.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      transaction,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createTransaction(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id || !data.transaction_type || data.points === undefined || !data.reason) {
      return res.status(400).json({
        success: false,
        message: "student_id, transaction_type, points, and reason are required",
      });
    }

    const transaction = await rewardService.create(data);
    return res.status(201).json({
      success: true,
      transaction,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}
