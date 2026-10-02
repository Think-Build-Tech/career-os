import { Certification } from "../../model/member/certification.model";
import { BaseRepository } from "../base.repository";

export class CertificationRepository extends BaseRepository<Certification> {
    constructor() {
        super(Certification);
    }
}
