import { Router } from "express";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
} from "./reward.controller";

export const rewardRouter = Router();

rewardRouter.get("/", getAllTransactions);
rewardRouter.post("/", createTransaction);
rewardRouter.get("/:id", getTransactionById);

