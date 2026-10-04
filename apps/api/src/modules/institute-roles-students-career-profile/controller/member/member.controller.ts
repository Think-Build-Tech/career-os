import { Request, Response, NextFunction } from "express";
import { MemberService } from "../../service/member/member.service";
import { getResourceId, getFindOptions } from "../controller.utils";

const service = new MemberService();
export const createMember = async (
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
export const getMembers = async (
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
export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await service.getById(getResourceId(req), getFindOptions(req));
    if (!item) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};
export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getResourceId(req);
    const [count] = await service.updateById(id, req.body);
    if (!count) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.json(await service.getById(id, getFindOptions(req)));
  } catch (error) {
    next(error);
  }
};
export const deleteMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!(await service.deleteById(getResourceId(req)))) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getPendingApprovals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const options = getFindOptions(req);
    options.where = { ...options.where, status: 'pending_approval' };
    res.json(await service.getAll(options));
  } catch (error) {
    next(error);
  }
};

export const approveMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getResourceId(req);
    // TODO: get adminId from req.user/req.auth once auth middleware is in place
    const member = await service.approveMember(id);
    if (!member) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.json(member);
  } catch (error) {
    next(error);
  }
};

export const rejectMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getResourceId(req);
    const member = await service.rejectMember(id);
    if (!member) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    res.json(member);
  } catch (error) {
    next(error);
  }
};
