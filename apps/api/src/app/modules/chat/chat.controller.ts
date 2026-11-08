import { Request, Response } from "express";
import {
  ConversationService,
  ConversationParticipantService,
  MessageService,
  MessageReadReceiptService,
} from "./services";

const conversationService = new ConversationService();
const participantService = new ConversationParticipantService();
const messageService = new MessageService();
const receiptService = new MessageReadReceiptService();

export async function getConversations(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const conversations = await conversationService.paginate({ page, limit });
    return res.status(200).json({ success: true, conversations });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getConversationById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const conversation = await conversationService.findById(id);
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
    return res.status(200).json({ success: true, conversation });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createConversation(req: Request, res: Response) {
  try {
    const data = req.body;
    const conversation = await conversationService.create(data);
    return res.status(201).json({ success: true, conversation });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const conversationId = req.params['id'] as string;
    const messages = await messageService.findAll({
      where: { conversation_id: conversationId } as any,
      order: [["created_at", "ASC"]],
    });
    return res.status(200).json({ success: true, messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.conversation_id || !data.sender_id || !data.content) {
      return res.status(400).json({ success: false, message: "conversation_id, sender_id, and content are required" });
    }
    if (!data.sender_type) {
      data.sender_type = "USER";
    }
    const message = await messageService.create(data);
    return res.status(201).json({ success: true, message });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function markMessageRead(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.message_id || !data.user_id) {
      return res.status(400).json({ success: false, message: "message_id and user_id are required" });
    }
    const receipt = await receiptService.create(data);
    return res.status(201).json({ success: true, receipt });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}
