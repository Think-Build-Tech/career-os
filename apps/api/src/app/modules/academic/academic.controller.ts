import { Request, Response } from "express";
import {
  StudentAcademicRecordService,
  StudentAcademicMembershipService,
  AcademicEventService,
} from "./services";

const recordService = new StudentAcademicRecordService();
const membershipService = new StudentAcademicMembershipService();
const eventService = new AcademicEventService();

// Academic Records (Append-only)
export async function getAllAcademicRecords(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const records = await recordService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      records,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getAcademicRecordById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide record ID",
      });
    }

    const record = await recordService.findById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Academic record not found",
      });
    }

    return res.status(200).json({
      success: true,
      record,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createAcademicRecord(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required",
      });
    }

    const record = await recordService.create(data);
    return res.status(201).json({
      success: true,
      record,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Academic Memberships
export async function getAllAcademicMemberships(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const memberships = await membershipService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      memberships,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getAcademicMembershipById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide membership ID",
      });
    }

    const membership = await membershipService.findById(id);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Academic membership not found",
      });
    }

    return res.status(200).json({
      success: true,
      membership,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createAcademicMembership(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required",
      });
    }

    const membership = await membershipService.create(data);
    return res.status(201).json({
      success: true,
      membership,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateAcademicMembership(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide membership ID",
      });
    }

    const membership = await membershipService.updateById(id, data);
    return res.status(200).json({
      success: true,
      membership,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Academic Events
export async function getAllAcademicEvents(req: Request, res: Response) {
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

export async function getAcademicEventById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide event ID",
      });
    }

    const event = await eventService.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Academic event not found",
      });
    }

    return res.status(200).json({
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

export async function createAcademicEvent(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.event_type || !data.title || !data.starts_at || !data.ends_at) {
      return res.status(400).json({
        success: false,
        message: "event_type, title, starts_at, and ends_at are required",
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

export async function updateAcademicEvent(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide event ID",
      });
    }

    const event = await eventService.updateById(id, data);
    return res.status(200).json({
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

export async function deleteAcademicEvent(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide event ID",
      });
    }

    await eventService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Academic event deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function checkAcademicConflicts(req: Request, res: Response) {
  try {
    const { department_id, program_id, cohort_id, starts_at, ends_at } = req.body;
    if (!starts_at || !ends_at) {
      return res.status(400).json({
        success: false,
        message: "starts_at and ends_at are required",
      });
    }

    const conflicts = await eventService.findConflictingEvents({
      department_id,
      program_id,
      cohort_id,
      starts_at: new Date(starts_at),
      ends_at: new Date(ends_at),
    });

    return res.status(200).json({
      success: true,
      conflicts,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

