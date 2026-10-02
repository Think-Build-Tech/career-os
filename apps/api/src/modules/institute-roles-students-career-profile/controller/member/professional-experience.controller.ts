import { Request, Response, NextFunction } from "express";
import { ProfessionalExperienceService } from "../../service/member/professional-experience.service";
import { getResourceId, getFindOptions } from "../controller.utils";
const service = new ProfessionalExperienceService();
export const createProfessionalExperience = async (
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
export const getProfessionalExperiences = async (
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
export const getProfessionalExperienceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await service.getById(getResourceId(req), getFindOptions(req));
    if (!item) {
      res.status(404).json({ message: "Professional experience not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};
export const updateProfessionalExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getResourceId(req);
    const [count] = await service.updateById(id, req.body);
    if (!count) {
      res.status(404).json({ message: "Professional experience not found" });
      return;
    }
    res.json(await service.getById(id, getFindOptions(req)));
  } catch (error) {
    next(error);
  }
};
export const deleteProfessionalExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!(await service.deleteById(getResourceId(req)))) {
      res.status(404).json({ message: "Professional experience not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
