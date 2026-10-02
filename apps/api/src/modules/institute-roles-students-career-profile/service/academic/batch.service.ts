import { Batch } from "../../model/academic/batches.model";
import { BatchRepository } from "../../repository/academic/batch.repository";
import { BaseService } from "../base.service";

export class BatchService extends BaseService<Batch> {
    constructor() {
        super(new BatchRepository());
    }
}
