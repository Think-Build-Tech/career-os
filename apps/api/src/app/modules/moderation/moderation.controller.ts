import { Request, Response } from "express";
import {
  MessageModerationService,
  MessageReportService,
  ModerationCaseService,
  ModerationActionService,
} from "./services";

const moderationService = new MessageModerationService();
const reportService = new MessageReportService();
const caseService = new ModerationCaseService();
const actionService = new ModerationActionService();

// Moderation
export async function getAllModerations(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const moderations = await moderationService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      moderations,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createModeration(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.message_id || !data.status || !data.risk_level) {
      return res.status(400).json({
        success: false,
        message: "message_id, status, and risk_level are required",
      });
    }

    const moderation = await moderationService.create(data);
    return res.status(201).json({
      success: true,
      moderation,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Reports
export async function getAllReports(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const reports = await reportService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createReport(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.message_id || !data.reporter_user_id || !data.category) {
      return res.status(400).json({
        success: false,
        message: "message_id, reporter_user_id, and category are required",
      });
    }

    const report = await reportService.create(data);
    return res.status(201).json({
      success: true,
      report,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateReportStatus(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const { status } = req.body;
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "id and status are required",
      });
    }

    const report = await reportService.updateById(id, { status } as any);
    return res.status(200).json({
      success: true,
      report,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Cases
export async function getAllCases(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const cases = await caseService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      cases,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getCaseById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide case ID",
      });
    }

    const moderationCase = await caseService.findById(id);
    if (!moderationCase) {
      return res.status(404).json({
        success: false,
        message: "Moderation case not found",
      });
    }

    return res.status(200).json({
      success: true,
      case: moderationCase,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createCase(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.message_id) {
      return res.status(400).json({
        success: false,
        message: "message_id is required",
      });
    }

    const moderationCase = await caseService.create(data);
    return res.status(201).json({
      success: true,
      case: moderationCase,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateCaseStatus(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const { status } = req.body;
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "id and status are required",
      });
    }

    const moderationCase = await caseService.updateById(id, { status } as any);
    return res.status(200).json({
      success: true,
      case: moderationCase,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Actions
export async function getAllActions(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const actions = await actionService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      actions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createAction(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.case_id || !data.action_type || !data.actor_user_id) {
      return res.status(400).json({
        success: false,
        message: "case_id, action_type, and actor_user_id are required",
      });
    }

    const action = await actionService.create(data);
    return res.status(201).json({
      success: true,
      action,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

