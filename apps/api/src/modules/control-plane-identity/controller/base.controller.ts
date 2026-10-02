import { Attributes, CreationAttributes, FindOptions, Model } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { BaseService } from "../service/base.service";

export abstract class BaseController<
    T extends Model,
    CreatePayload = CreationAttributes<T>,
    UpdatePayload = Partial<Attributes<T>>,
> {
    protected constructor(protected readonly service: BaseService<T, CreatePayload, UpdatePayload>) {}

    async create(req: Request<Record<string, string>, unknown, CreatePayload>, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.create(req.body);
            res.status(201).json(entity);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.getById(this.getId(req), this.getFindOptions(req));
            if (!entity) {
                res.status(404).json({ message: "Resource not found" });
                return;
            }

            res.json(entity);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entities = await this.service.getAll(this.getFindOptions(req));
            res.json(entities);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request<Record<string, string>, unknown, UpdatePayload>, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = this.getId(req);
            const [affectedCount] = await this.service.updateById(id, req.body);
            if (affectedCount === 0) {
                res.status(404).json({ message: "Resource not found" });
                return;
            }

            const entity = await this.service.getById(id, this.getFindOptions(req));
            res.json(entity);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deletedCount = await this.service.deleteById(this.getId(req));
            if (deletedCount === 0) {
                res.status(404).json({ message: "Resource not found" });
                return;
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    protected getFindOptions(req: Request): FindOptions<Attributes<T>> {
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
    }

    private getId(req: Request): string {
        const { id } = req.params;
        return Array.isArray(id) ? id[0] : id;
    }
}
