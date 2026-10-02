import { createResourceHandlers } from "../../../core/controller.utils";
import { EventRegistrations } from "../model/event_registrations.model";
import { EventRegistrationsService } from "../service/event-registrations.service";

const service = new EventRegistrationsService();
const handlers = createResourceHandlers<EventRegistrations>(service);

export const createEventRegistrations = handlers.create;
export const getEventRegistrationss = handlers.getAll;
export const getEventRegistrationsById = handlers.getById;
export const updateEventRegistrations = handlers.update;
export const deleteEventRegistrations = handlers.delete;
