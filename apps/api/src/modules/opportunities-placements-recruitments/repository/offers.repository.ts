import { BaseRepository } from "../../../core/base.repository";
import { Offers } from "../model/offers.model";

export class OffersRepository extends BaseRepository<Offers> {
    constructor() {
        super(Offers);
    }
}
