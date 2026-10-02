import { BaseService } from "../../../core/base.service";
import { ContentReports } from "../model/content_reports.model";
import { ContentReportsRepository } from "../repository/content-reports.repository";

export class ContentReportsService extends BaseService<ContentReports> {
    constructor() {
        super(new ContentReportsRepository());
    }
}
