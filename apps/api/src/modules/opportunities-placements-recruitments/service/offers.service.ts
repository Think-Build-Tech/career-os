import { BaseService } from "../../../core/base.service";
import { Offers } from "../model/offers.model";
import { OffersRepository } from "../repository/offers.repository";

export class OffersService extends BaseService<Offers> {
    constructor() {
        super(new OffersRepository());
    }
}
