import { Op } from "sequelize";
import { CrudService, MutableService, MutationOptions } from "../../services";
import {
  StudentActionItem,
  StudentCareerProfile,
  StudentPrivacyPreference,
  StudentProfile,
  StudentRequest,
} from "../models";

export class StudentProfileService extends MutableService<StudentProfile> {
  constructor() {
    super(StudentProfile);
  }
}

export class StudentCareerProfileService extends CrudService<StudentCareerProfile> {
  constructor() {
    super(StudentCareerProfile);
  }
}

export class StudentPrivacyPreferenceService extends MutableService<StudentPrivacyPreference> {
  constructor() {
    super(StudentPrivacyPreference);
  }

  async getOrCreate(student_id: string, options: MutationOptions = {}): Promise<StudentPrivacyPreference> {
    const existing = await this.model.findOne({
      where: { student_id },
      transaction: options.transaction,
    });
    if (existing) {
      return existing;
    }
    return this.model.create(
      {
        student_id,
        recruiter_discovery_enabled: true,
        resume_visibility: "VERIFIED_ONLY",
        alumni_connection_enabled: true,
        learning_profile_visibility: "COHORT_ONLY",
        assessment_visibility: "TPO_ONLY",
      },
      { transaction: options.transaction }
    );
  }

  async updatePreferences(
    student_id: string,
    updates: Partial<StudentPrivacyPreference>,
    options: MutationOptions = {}
  ): Promise<StudentPrivacyPreference> {
    const pref = await this.getOrCreate(student_id, options);
    pref.set(updates);
    return pref.save({ transaction: options.transaction });
  }

  async canView(
    student_id: string,
    field: "recruiter_discovery" | "alumni_connection"
  ): Promise<boolean> {
    const pref = await this.getOrCreate(student_id);
    if (field === "recruiter_discovery") {
      return Boolean(pref.recruiter_discovery_enabled);
    }
    if (field === "alumni_connection") {
      return Boolean(pref.alumni_connection_enabled);
    }
    return true;
  }
}

export class StudentRequestService extends CrudService<StudentRequest> {
  constructor() {
    super(StudentRequest);
  }

  async submitRequest(
    data: {
      student_id: string;
      request_type: string;
      title: string;
      details: string;
      supporting_document_url?: string | null;
      target_entity_type?: string | null;
      target_entity_id?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<StudentRequest> {
    return this.model.create(
      {
        ...data,
        status: "PENDING",
      },
      { transaction: options.transaction }
    );
  }

  async reviewRequest(
    requestId: string,
    review: {
      reviewed_by: string;
      status: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
      reviewer_notes?: string | null;
      generated_document_key?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<StudentRequest> {
    const request = await this.requireById(requestId, { transaction: options.transaction });
    request.set({
      status: review.status,
      reviewed_by: review.reviewed_by,
      reviewed_at: new Date(),
      reviewer_notes: review.reviewer_notes ?? null,
      generated_document_key: review.generated_document_key ?? request.generated_document_key,
    });
    return request.save({ transaction: options.transaction });
  }

  async getPendingRequests(request_type?: string): Promise<StudentRequest[]> {
    const where: Record<string, unknown> = { status: "PENDING" };
    if (request_type) {
      where.request_type = request_type;
    }
    return this.model.findAll({
      where,
      order: [["created_at", "ASC"]],
    });
  }

  async getStudentRequests(student_id: string): Promise<StudentRequest[]> {
    return this.model.findAll({
      where: { student_id },
      order: [["created_at", "DESC"]],
    });
  }
}

export class StudentActionItemService extends CrudService<StudentActionItem> {
  constructor() {
    super(StudentActionItem);
  }

  async createActionItem(
    data: {
      student_id: string;
      action_type: string;
      title: string;
      description?: string | null;
      priority?: string;
      deadline?: Date | null;
      action_url?: string | null;
      target_entity_type?: string | null;
      target_entity_id?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<StudentActionItem> {
    return this.model.create(
      {
        ...data,
        status: "PENDING",
        priority: data.priority ?? "NORMAL",
      },
      { transaction: options.transaction }
    );
  }

  async completeActionItem(id: string, options: MutationOptions = {}): Promise<StudentActionItem> {
    const item = await this.requireById(id, { transaction: options.transaction });
    item.set({
      status: "COMPLETED",
      completed_at: new Date(),
    });
    return item.save({ transaction: options.transaction });
  }

  async cancelActionItem(id: string, options: MutationOptions = {}): Promise<StudentActionItem> {
    const item = await this.requireById(id, { transaction: options.transaction });
    item.set({ status: "CANCELLED" });
    return item.save({ transaction: options.transaction });
  }

  async waiveActionItem(id: string, options: MutationOptions = {}): Promise<StudentActionItem> {
    const item = await this.requireById(id, { transaction: options.transaction });
    item.set({ status: "WAIVED" });
    return item.save({ transaction: options.transaction });
  }

  async expireOverdue(student_id?: string, options: MutationOptions = {}): Promise<number> {
    const where: Record<string, unknown> = {
      status: "PENDING",
      deadline: { [Op.lt]: new Date() },
    };
    if (student_id) {
      where.student_id = student_id;
    }
    const [affectedCount] = await this.model.update(
      { status: "EXPIRED" },
      { where, transaction: options.transaction }
    );
    return affectedCount;
  }

  async getActiveQueue(student_id: string): Promise<StudentActionItem[]> {
    return this.model.findAll({
      where: {
        student_id,
        status: "PENDING",
      },
      order: [
        ["priority", "DESC"],
        ["deadline", "ASC"],
        ["created_at", "ASC"],
      ],
    });
  }
}

