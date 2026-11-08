import { Request, Response } from "express";
import {
  AlumniProfileService,
  ReferralPostService,
  ReferralRequestService,
  MentorshipBookingService,
  AlumniConnectionRequestService,
} from "./services";

const profileService = new AlumniProfileService();
const referralPostService = new ReferralPostService();
const referralRequestService = new ReferralRequestService();
const mentorshipService = new MentorshipBookingService();
const connectionService = new AlumniConnectionRequestService();

export async function getAlumniProfiles(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const profiles = await profileService.paginate({ page, limit });
    return res.status(200).json({ success: true, profiles });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getAlumniById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const profile = await profileService.findById(id);
    if (!profile) return res.status(404).json({ success: false, message: "Alumni profile not found" });
    return res.status(200).json({ success: true, profile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createAlumniProfile(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.user_id) {
      return res.status(400).json({ success: false, message: "user_id is required" });
    }
    const profile = await profileService.create(data);
    return res.status(201).json({ success: true, profile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getReferralPosts(req: Request, res: Response) {
  try {
    const posts = await referralPostService.findAll();
    return res.status(200).json({ success: true, posts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createReferralPost(req: Request, res: Response) {
  try {
    const post = await referralPostService.create(req.body);
    return res.status(201).json({ success: true, post });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function requestReferral(req: Request, res: Response) {
  try {
    const reqData = await referralRequestService.create(req.body);
    return res.status(201).json({ success: true, referralRequest: reqData });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function bookMentorshipSlot(req: Request, res: Response) {
  try {
    const { slotId, studentId, notes } = req.body;
    if (!slotId || !studentId) {
      return res.status(400).json({ success: false, message: "slotId and studentId are required" });
    }
    const booking = await mentorshipService.bookSlot(slotId, studentId, notes);
    return res.status(201).json({ success: true, booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function requestConnection(req: Request, res: Response) {
  try {
    const conn = await connectionService.create(req.body);
    return res.status(201).json({ success: true, connectionRequest: conn });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}
