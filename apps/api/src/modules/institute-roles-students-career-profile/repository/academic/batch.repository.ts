import { Batch } from "../../model/academic/batches.model";
import { BaseRepository } from "../base.repository";

export class BatchRepository extends BaseRepository<Batch> {
    constructor() {
        super(Batch);
    }
}
