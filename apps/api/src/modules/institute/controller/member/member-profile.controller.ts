import { Request, Response, NextFunction } from "express";
import { MemberProfileService } from "../../service/member/member-profile.service";
import { getResourceId, getFindOptions } from "../controller.utils";
const service = new MemberProfileService();
export const createMemberProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (error) {
    next(error);
  }
};
export const getMemberProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await service.getAll(getFindOptions(req)));
  } catch (error) {
    next(error);
  }
};
export const getMemberProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await service.getById(getResourceId(req), getFindOptions(req));
    if (!item) {
      res.status(404).json({ message: "Member profile not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};
export const updateMemberProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getResourceId(req);
    const [count] = await service.updateById(id, req.body);
    if (!count) {
      res.status(404).json({ message: "Member profile not found" });
      return;
    }
    res.json(await service.getById(id, getFindOptions(req)));
  } catch (error) {
    next(error);
  }
};
export const deleteMemberProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!(await service.deleteById(getResourceId(req)))) {
      res.status(404).json({ message: "Member profile not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
