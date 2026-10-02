import { Project } from "../../model/member/projects.model";
import { ProjectRepository } from "../../repository/member/project.repository";
import { BaseService } from "../base.service";

export class ProjectService extends BaseService<Project> {
    constructor() {
        super(new ProjectRepository());
    }
}
