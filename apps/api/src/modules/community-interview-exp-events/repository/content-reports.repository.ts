import { BaseRepository } from "../../../core/base.repository";
import { ContentReports } from "../model/content_reports.model";

export class ContentReportsRepository extends BaseRepository<ContentReports> {
    constructor() {
        super(ContentReports);
    }
}
