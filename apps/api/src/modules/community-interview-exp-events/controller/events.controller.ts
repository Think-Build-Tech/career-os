import { createResourceHandlers } from "../../../core/controller.utils";
import { Events } from "../model/events.model";
import { EventsService } from "../service/events.service";

const service = new EventsService();
const handlers = createResourceHandlers<Events>(service);

export const createEvents = handlers.create;
export const getEventss = handlers.getAll;
export const getEventsById = handlers.getById;
export const updateEvents = handlers.update;
export const deleteEvents = handlers.delete;
