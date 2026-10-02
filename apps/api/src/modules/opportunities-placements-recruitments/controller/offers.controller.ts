import { createResourceHandlers } from "../../../core/controller.utils";
import { Offers } from "../model/offers.model";
import { OffersService } from "../service/offers.service";

const service = new OffersService();
const handlers = createResourceHandlers<Offers>(service);

export const createOffers = handlers.create;
export const getOfferss = handlers.getAll;
export const getOffersById = handlers.getById;
export const updateOffers = handlers.update;
export const deleteOffers = handlers.delete;
