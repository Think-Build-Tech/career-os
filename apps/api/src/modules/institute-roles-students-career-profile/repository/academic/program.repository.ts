import { Program } from "../../model/academic/programs.model";
import { BaseRepository } from "../base.repository";

export class ProgramRepository extends BaseRepository<Program> {
    constructor() {
        super(Program);
    }
}
