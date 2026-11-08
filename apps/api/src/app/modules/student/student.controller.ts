import { Request, Response } from "express";
import {
  StudentProfileService,
  StudentCareerProfileService,
  StudentPrivacyPreferenceService,
  StudentRequestService,
  StudentActionItemService,
} from "./services";

const profileService = new StudentProfileService();
const careerProfileService = new StudentCareerProfileService();
const privacyService = new StudentPrivacyPreferenceService();
const requestService = new StudentRequestService();
const actionItemService = new StudentActionItemService();

export async function getAllStudents(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const students = await profileService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      students,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getStudentById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const student = await profileService.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.user_id || !data.enrollment_number) {
      return res.status(400).json({
        success: false,
        message: "user_id and enrollment_number are required",
      });
    }

    const student = await profileService.create(data);
    return res.status(201).json({
      success: true,
      student,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateStudent(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    const student = await profileService.updateById(id, data);
    return res.status(200).json({
      success: true,
      student,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getCareerProfile(req: Request, res: Response) {
  try {
    const studentId = req.params['id'] as string;
    const profile = await careerProfileService.findById(studentId);
    return res.status(200).json({
      success: true,
      careerProfile: profile,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updatePrivacyPreferences(req: Request, res: Response) {
  try {
    const studentId = req.params['id'] as string;
    const prefs = await privacyService.updatePreferences(studentId, req.body);
    return res.status(200).json({
      success: true,
      preferences: prefs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function submitStudentRequest(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id || !data.request_type || !data.title || !data.details) {
      return res.status(400).json({
        success: false,
        message: "student_id, request_type, title, and details are required",
      });
    }

    const request = await requestService.submitRequest(data);
    return res.status(201).json({
      success: true,
      request,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getPendingRequests(req: Request, res: Response) {
  try {
    const requests = await requestService.getPendingRequests();
    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createActionItem(req: Request, res: Response) {
  try {
    const item = await actionItemService.createActionItem(req.body);
    return res.status(201).json({
      success: true,
      actionItem: item,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getActionItems(req: Request, res: Response) {
  try {
    const studentId = String(req.query["student_id"] ?? "");
    if (!studentId) return res.status(400).json({ success: false, message: "student_id is required" });
    const actionItems = await actionItemService.getActiveQueue(studentId);
    return res.status(200).json({ success: true, actionItems });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function completeActionItem(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const item = await actionItemService.completeActionItem(id);
    return res.status(200).json({
      success: true,
      actionItem: item,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

