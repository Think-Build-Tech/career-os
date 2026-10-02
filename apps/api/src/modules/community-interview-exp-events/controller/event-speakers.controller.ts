import { createResourceHandlers } from "../../../core/controller.utils";
import { EventSpeakers } from "../model/event_speakers.model";
import { EventSpeakersService } from "../service/event-speakers.service";

const service = new EventSpeakersService();
const handlers = createResourceHandlers<EventSpeakers>(service);

export const createEventSpeakers = handlers.create;
export const getEventSpeakerss = handlers.getAll;
export const getEventSpeakersById = handlers.getById;
export const updateEventSpeakers = handlers.update;
export const deleteEventSpeakers = handlers.delete;
