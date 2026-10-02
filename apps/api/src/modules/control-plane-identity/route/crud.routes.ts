import { Router } from "express";
import { Attributes, CreationAttributes, Model } from "sequelize";
import { BaseController } from "../controller/base.controller";

export const createCrudRouter = <
    T extends Model,
    CreatePayload = CreationAttributes<T>,
    UpdatePayload = Partial<Attributes<T>>,
>(controller: BaseController<T, CreatePayload, UpdatePayload>): Router => {
    const router = Router();

    router.route("/")
        .get(controller.getAll.bind(controller))
        .post(controller.create.bind(controller));

    router.route("/:id")
        .get(controller.getById.bind(controller))
        .patch(controller.update.bind(controller))
        .delete(controller.delete.bind(controller));

    return router;
};
