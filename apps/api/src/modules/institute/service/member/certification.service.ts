import { Certification } from "../../model/member/certification.model";
import { CertificationRepository } from "../../repository/member/certification.repository";
import { BaseService } from "../base.service";

export class CertificationService extends BaseService<Certification> {
    constructor() {
        super(new CertificationRepository());
    }
}
