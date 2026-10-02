import { Request, Response, NextFunction } from "express";
import { CertificationService } from "../../service/member/certification.service";
import { getResourceId, getFindOptions } from "../controller.utils";
const service = new CertificationService();
export const createCertification = async (
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
export const getCertifications = async (
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
export const getCertificationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await service.getById(getResourceId(req), getFindOptions(req));
    if (!item) {
      res.status(404).json({ message: "Certification not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};
export const updateCertification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getResourceId(req);
    const [count] = await service.updateById(id, req.body);
    if (!count) {
      res.status(404).json({ message: "Certification not found" });
      return;
    }
    res.json(await service.getById(id, getFindOptions(req)));
  } catch (error) {
    next(error);
  }
};
export const deleteCertification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!(await service.deleteById(getResourceId(req)))) {
      res.status(404).json({ message: "Certification not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
