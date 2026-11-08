import { Router } from "express";
import {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessage,
  markMessageRead,
} from "./chat.controller";

export const chatRouter = Router();

chatRouter.get("/conversations", getConversations);
chatRouter.post("/conversations", createConversation);
chatRouter.get("/conversations/:id", getConversationById);
chatRouter.get("/conversations/:id/messages", getMessages);
chatRouter.post("/messages", sendMessage);
chatRouter.post("/messages/read", markMessageRead);

