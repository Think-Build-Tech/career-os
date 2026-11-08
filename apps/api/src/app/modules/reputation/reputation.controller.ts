import { Request, Response } from "express";
import {
  StudentReputationEventService,
  StudentReputationSummaryService,
} from "./services";

const eventService = new StudentReputationEventService();
const summaryService = new StudentReputationSummaryService();

// Events
export async function getAllReputationEvents(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const events = await eventService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createReputationEvent(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id || !data.event_type || data.points === undefined) {
      return res.status(400).json({
        success: false,
        message: "student_id, event_type, and points are required",
      });
    }

    const event = await eventService.create(data);
    return res.status(201).json({
      success: true,
      event,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Summary
export async function getAllReputationSummaries(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const summaries = await summaryService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      summaries,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getReputationSummaryByStudent(req: Request, res: Response) {
  try {
    const studentId = req.params['studentId'] as string;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const summary = await summaryService.findAll({
      where: { student_id: studentId } as any,
      limit: 1,
    });

    return res.status(200).json({
      success: true,
      summary: summary[0] || null,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateReputationSummary(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide summary ID",
      });
    }

    const summary = await summaryService.updateById(id, data);
    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}
