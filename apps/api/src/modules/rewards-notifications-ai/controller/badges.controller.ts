import { createResourceHandlers } from "../../../core/controller.utils";
import { Badges } from "../model/badges.model";
import { BadgesService } from "../service/badges.service";

const service = new BadgesService();
const handlers = createResourceHandlers<Badges>(service);

export const createBadges = handlers.create;
export const getBadgess = handlers.getAll;
export const getBadgesById = handlers.getById;
export const updateBadges = handlers.update;
export const deleteBadges = handlers.delete;
