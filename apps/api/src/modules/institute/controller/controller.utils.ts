import { NextFunction, Request, Response } from "express";
import { Attributes, FindOptions, Model, WhereOptions } from "sequelize";
import { BaseService } from "../service/base.service";

export const getResourceId = (req: Request): string => {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
};

export const getFindOptions = <T extends Model>(
  req: Request,
): FindOptions<Attributes<T>> => {
  const include = req.query.include;
  if (!include) {
    return {};
  }

  const aliases = Array.isArray(include) ? include : [include];
  return {
    include: aliases
      .flatMap((value) => String(value).split(","))
      .map((value) => value.trim())
      .filter(Boolean),
  };
};

export const createResource = async <T extends Model>(
  service: BaseService<T>,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const entity = await service.create(req.body);
    res.status(201).json(entity);
  } catch (error) {
    next(error);
  }
};

export const getResources = async <T extends Model>(
  service: BaseService<T>,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.json(await service.getAll(getFindOptions<T>(req)));
  } catch (error) {
    next(error);
  }
};

export const getResource = async <T extends Model>(
  service: BaseService<T>,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const entity = await service.getById(
      getResourceId(req),
      getFindOptions<T>(req),
    );
    if (!entity) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }

    res.json(entity);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async <T extends Model>(
  service: BaseService<T>,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getResourceId(req);
    const [affectedCount] = await service.updateById(id, req.body);
    if (affectedCount === 0) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }

    res.json(await service.getById(id, getFindOptions<T>(req)));
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async <T extends Model>(
  service: BaseService<T>,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deletedCount = await service.deleteById(getResourceId(req));
    if (deletedCount === 0) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export type ResourceHandlers<T extends Model> = {
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

export const createResourceHandlers = <T extends Model>(
  service: BaseService<T>,
): ResourceHandlers<T> => ({
  create: (req, res, next) => createResource(service, req, res, next),
  getAll: (req, res, next) => getResources(service, req, res, next),
  getById: (req, res, next) => getResource(service, req, res, next),
  update: (req, res, next) => updateResource(service, req, res, next),
  delete: (req, res, next) => deleteResource(service, req, res, next),
});
