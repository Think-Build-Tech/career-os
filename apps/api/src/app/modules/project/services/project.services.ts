import { Transaction } from "sequelize";
import { sequelize } from "../../../config/database";
import { CrudService, MutationOptions } from "../../services";
import { ProjectSkill, StudentProject } from "../models";

export class StudentProjectService extends CrudService<StudentProject> {
  constructor() { super(StudentProject); }

  async createProjectWithSkills(
    projectData: {
      student_id: string;
      title: string;
      description: string;
      summary?: string | null;
      project_type?: string;
      student_role?: string | null;
      contribution_description?: string | null;
      impact_description?: string | null;
      github_url?: string | null;
      project_url?: string | null;
      technology_stack?: string[];
      start_date?: Date | null;
      end_date?: Date | null;
      is_ongoing?: boolean;
      visibility?: string;
    },
    skillIds: string[] = [],
    options: MutationOptions = {}
  ): Promise<StudentProject> {
    const execute = async (t: Transaction) => {
      const project = await this.model.create(
        {
          ...projectData,
          verification_status: "UNVERIFIED",
        },
        { transaction: t }
      );

      if (skillIds.length > 0) {
        for (const skillId of skillIds) {
          await ProjectSkill.create(
            {
              project_id: project.id,
              skill_id: skillId,
            },
            { transaction: t }
          );
        }
      }

      return project;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  async verifyProject(
    projectId: string,
    verifiedByUserId: string,
    status: "VERIFIED" | "REJECTED" = "VERIFIED",
    options: MutationOptions = {}
  ): Promise<StudentProject> {
    const project = await this.requireById(projectId, { transaction: options.transaction });
    project.set({
      verification_status: status,
      verified_by: verifiedByUserId,
      verified_at: new Date(),
    });
    return project.save({ transaction: options.transaction });
  }

  async getStudentProjects(
    studentId: string,
    visibility?: string
  ): Promise<StudentProject[]> {
    const where: Record<string, unknown> = { student_id: studentId };
    if (visibility) {
      where.visibility = visibility;
    }
    return this.model.findAll({
      where,
      include: ["project_skills"],
      order: [["created_at", "DESC"]],
    });
  }
}

export class ProjectSkillService extends CrudService<ProjectSkill> {
  constructor() { super(ProjectSkill); }
}

