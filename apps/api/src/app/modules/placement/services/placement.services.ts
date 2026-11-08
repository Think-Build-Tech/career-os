import { Transaction } from "sequelize";
import { sequelize } from "../../../config/database";
import { InvalidServiceInputError } from "../../services/service.errors";
import { CreateReadService, CrudService, MutableService, MutationOptions } from "../../services";
import { StudentProfile } from "../../student/models/student.model";
import {
  ApplicationStatusHistory,
  ArtifactAttestation,
  DriveDepartment,
  DriveRound,
  EligibilityEvaluation,
  EligibilityRuleSet,
  JobApplication,
  JobDescriptionVersion,
  JobOffer,
  JobOpportunity,
  OfferCompensationComponent,
  OpportunitySubmission,
  OpportunityVerification,
  PlacementComplianceEvent,
  PlacementDrive,
  PlacementPolicy,
  PlacementPolicyRule,
  PlacementRecord,
  PlacementSeason,
  PlacementTier,
  StudentPlacementCompliance,
  StudentRoundResult,
  SubmissionReview,
  UserAgreement,
} from "../models";

export class PlacementSeasonService extends CrudService<PlacementSeason> {
  constructor() { super(PlacementSeason); }
}
export class JobOpportunityService extends CrudService<JobOpportunity> {
  constructor() { super(JobOpportunity); }
}
export class JobDescriptionVersionService extends CreateReadService<JobDescriptionVersion> {
  constructor() { super(JobDescriptionVersion); }
}
export class PlacementTierService extends CrudService<PlacementTier> {
  constructor() { super(PlacementTier); }
}
export class PlacementDriveService extends CrudService<PlacementDrive> {
  constructor() { super(PlacementDrive); }
}
export class DriveDepartmentService extends CrudService<DriveDepartment> {
  constructor() { super(DriveDepartment); }
}
export class DriveRoundService extends CrudService<DriveRound> {
  constructor() { super(DriveRound); }
}
export class EligibilityRuleSetService extends CreateReadService<EligibilityRuleSet> {
  constructor() { super(EligibilityRuleSet); }
}
export class EligibilityEvaluationService extends CreateReadService<EligibilityEvaluation> {
  constructor() { super(EligibilityEvaluation); }
}

export class JobApplicationService extends MutableService<JobApplication> {
  constructor() { super(JobApplication); }

  async apply(
    data: {
      student_id: string;
      job_opportunity_id: string;
      drive_id?: string | null;
      resume_version_id: string;
    },
    options: MutationOptions = {}
  ): Promise<JobApplication> {
    const execute = async (t: Transaction) => {
      const application = await this.model.create(
        {
          student_id: data.student_id,
          job_opportunity_id: data.job_opportunity_id,
          drive_id: data.drive_id ?? null,
          resume_version_id: data.resume_version_id,
          status: "APPLIED",
          applied_at: new Date(),
        },
        { transaction: t }
      );

      let changedBy = (data as any).changed_by || (data as any).user_id;
      if (!changedBy && data.student_id) {
        try {
          const profile = await StudentProfile.findByPk(data.student_id, { transaction: t });
          changedBy = profile?.get('user_id') || data.student_id;
        } catch {
          changedBy = data.student_id;
        }
      }

      await ApplicationStatusHistory.create(
        {
          application_id: application.id,
          from_status: null,
          to_status: "APPLIED",
          changed_by: changedBy,
          reason: "Student submitted application",
        },
        { transaction: t }
      );

      return application;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  async updateStatus(
    applicationId: string,
    toStatus: string,
    changedByUserId: string,
    reason?: string | null,
    options: MutationOptions = {}
  ): Promise<JobApplication> {
    const execute = async (t: Transaction) => {
      const application = await this.requireById(applicationId, { transaction: t });
      const previousStatus = application.status;

      application.set({ status: toStatus });
      await application.save({ transaction: t });

      await ApplicationStatusHistory.create(
        {
          application_id: application.id,
          from_status: previousStatus,
          to_status: toStatus,
          changed_by: changedByUserId,
          reason: reason ?? null,
        },
        { transaction: t }
      );

      return application;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }
}

export class ApplicationStatusHistoryService extends CreateReadService<ApplicationStatusHistory> {
  constructor() { super(ApplicationStatusHistory); }
}
export class StudentRoundResultService extends MutableService<StudentRoundResult> {
  constructor() { super(StudentRoundResult); }
}

export class JobOfferService extends MutableService<JobOffer> {
  constructor() { super(JobOffer); }

  async createOfferWithComponents(
    offerData: {
      student_id: string;
      application_id: string;
      job_opportunity_id: string;
      company_id?: string | null;
      placement_tier_id?: string | null;
      total_ctc?: number | null;
      currency?: string;
      offer_date?: Date | null;
      decision_deadline?: Date | null;
      joining_date?: Date | null;
      offer_letter_object_key?: string | null;
    },
    components: Array<{
      component_type: string;
      amount: number;
      currency?: string;
      frequency?: string;
      description?: string | null;
      is_guaranteed?: boolean;
    }> = [],
    options: MutationOptions = {}
  ): Promise<JobOffer> {
    const execute = async (t: Transaction) => {
      const offer = await this.model.create(
        {
          ...offerData,
          status: "ISSUED",
          currency: offerData.currency ?? "INR",
          offered_at: new Date(),
        },
        { transaction: t }
      );

      if (components.length > 0) {
        for (const comp of components) {
          await OfferCompensationComponent.create(
            {
              job_offer_id: offer.id,
              component_type: comp.component_type,
              amount: comp.amount,
              currency: comp.currency ?? offer.currency,
              frequency: comp.frequency ?? "ANNUAL",
              description: comp.description ?? null,
              is_guaranteed: comp.is_guaranteed ?? true,
            },
            { transaction: t }
          );
        }
      }

      return offer;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  async acceptOffer(
    offerId: string,
    studentId: string,
    details: {
      signed_document_object_key?: string | null;
      signature_reference?: string | null;
    } = {},
    options: MutationOptions = {}
  ): Promise<JobOffer> {
    const execute = async (t: Transaction) => {
      const offer = await this.requireById(offerId, { transaction: t });
      if (offer.student_id !== studentId) {
        throw new InvalidServiceInputError("Unauthorized: Offer does not belong to this student");
      }
      if (offer.status === "ACCEPTED") {
        return offer;
      }
      if (offer.decision_deadline && new Date() > new Date(offer.decision_deadline)) {
        throw new InvalidServiceInputError("Offer decision deadline has expired");
      }

      offer.set({
        status: "ACCEPTED",
        accepted_at: new Date(),
        responded_at: new Date(),
        signed_document_object_key: details.signed_document_object_key ?? offer.signed_document_object_key,
        signature_reference: details.signature_reference ?? offer.signature_reference,
      });

      return offer.save({ transaction: t });
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  async declineOffer(
    offerId: string,
    studentId: string,
    decline_reason: string,
    options: MutationOptions = {}
  ): Promise<JobOffer> {
    const execute = async (t: Transaction) => {
      const offer = await this.requireById(offerId, { transaction: t });
      if (offer.student_id !== studentId) {
        throw new InvalidServiceInputError("Unauthorized: Offer does not belong to this student");
      }

      offer.set({
        status: "DECLINED",
        declined_at: new Date(),
        responded_at: new Date(),
        decline_reason,
      });

      return offer.save({ transaction: t });
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }
}

export class OfferCompensationComponentService extends CrudService<OfferCompensationComponent> {
  constructor() { super(OfferCompensationComponent); }
}
export class PlacementRecordService extends MutableService<PlacementRecord> {
  constructor() { super(PlacementRecord); }
}
export class PlacementPolicyService extends CreateReadService<PlacementPolicy> {
  constructor() { super(PlacementPolicy); }
}
export class PlacementPolicyRuleService extends CreateReadService<PlacementPolicyRule> {
  constructor() { super(PlacementPolicyRule); }
}
export class OpportunitySubmissionService extends MutableService<OpportunitySubmission> {
  constructor() { super(OpportunitySubmission); }
}
export class OpportunityVerificationService extends CreateReadService<OpportunityVerification> {
  constructor() { super(OpportunityVerification); }
}
export class SubmissionReviewService extends CreateReadService<SubmissionReview> {
  constructor() { super(SubmissionReview); }
}
export class PlacementComplianceEventService extends CreateReadService<PlacementComplianceEvent> {
  constructor() { super(PlacementComplianceEvent); }
}

export class StudentPlacementComplianceService extends MutableService<StudentPlacementCompliance> {
  constructor() { super(StudentPlacementCompliance); }

  async getOrCreate(student_id: string, options: MutationOptions = {}): Promise<StudentPlacementCompliance> {
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
        active_strikes: 0,
        total_strikes: 0,
        compliance_status: "GOOD_STANDING",
      },
      { transaction: options.transaction }
    );
  }

  /**
   * Records a strike/violation event and automatically updates compliance standing.
   */
  async recordViolation(
    data: {
      student_id: string;
      event_type: string;
      reason: string;
      recorded_by: string;
      strike_delta?: number;
      drive_id?: string | null;
      application_id?: string | null;
      evidence_url?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<{ event: PlacementComplianceEvent; compliance: StudentPlacementCompliance }> {
    const execute = async (t: Transaction) => {
      const strikeDelta = data.strike_delta ?? 1;

      const event = await PlacementComplianceEvent.create(
        {
          student_id: data.student_id,
          event_type: data.event_type,
          strike_delta: strikeDelta,
          reason: data.reason,
          recorded_by: data.recorded_by,
          drive_id: data.drive_id ?? null,
          application_id: data.application_id ?? null,
          evidence_url: data.evidence_url ?? null,
        },
        { transaction: t }
      );

      const compliance = await this.getOrCreate(data.student_id, { transaction: t });
      const newActive = Math.max(0, compliance.active_strikes + strikeDelta);
      const newTotal = compliance.total_strikes + (strikeDelta > 0 ? strikeDelta : 0);

      let newStatus = "GOOD_STANDING";
      if (newActive >= 3) {
        newStatus = "DEBARRED";
      } else if (newActive >= 1) {
        newStatus = "WARNED";
      }

      compliance.set({
        active_strikes: newActive,
        total_strikes: newTotal,
        compliance_status: newStatus,
        last_event_at: new Date(),
      });
      await compliance.save({ transaction: t });

      return { event, compliance };
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  /**
   * Reverses a previously issued strike.
   * Rule: Never decrement a strike count without creating an explicit reversal event.
   */
  async reverseStrike(
    data: {
      student_id: string;
      compliance_event_id: string;
      reason: string;
      recorded_by: string;
    },
    options: MutationOptions = {}
  ): Promise<{ reversalEvent: PlacementComplianceEvent; compliance: StudentPlacementCompliance }> {
    const execute = async (t: Transaction) => {
      const reversalEvent = await PlacementComplianceEvent.create(
        {
          student_id: data.student_id,
          event_type: "STRIKE_REVERSED",
          strike_delta: -1,
          reason: data.reason,
          recorded_by: data.recorded_by,
          reversal_event_id: data.compliance_event_id,
        },
        { transaction: t }
      );

      const compliance = await this.getOrCreate(data.student_id, { transaction: t });
      const newActive = Math.max(0, compliance.active_strikes - 1);

      let newStatus = "GOOD_STANDING";
      if (newActive >= 3) {
        newStatus = "DEBARRED";
      } else if (newActive >= 1) {
        newStatus = "WARNED";
      }

      compliance.set({
        active_strikes: newActive,
        compliance_status: newStatus,
        last_event_at: new Date(),
      });
      await compliance.save({ transaction: t });

      return { reversalEvent, compliance };
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  /**
   * Excuses an absence without penalizing the student.
   */
  async excuseAbsence(
    data: {
      student_id: string;
      reason: string;
      recorded_by: string;
      drive_id?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<PlacementComplianceEvent> {
    const execute = async (t: Transaction) => {
      const event = await PlacementComplianceEvent.create(
        {
          student_id: data.student_id,
          event_type: "EXCUSED_ABSENCE",
          strike_delta: 0,
          reason: data.reason,
          recorded_by: data.recorded_by,
          drive_id: data.drive_id ?? null,
        },
        { transaction: t }
      );

      const compliance = await this.getOrCreate(data.student_id, { transaction: t });
      compliance.set({ last_event_at: new Date() });
      await compliance.save({ transaction: t });

      return event;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }
}

export class UserAgreementService extends CreateReadService<UserAgreement> {
  constructor() { super(UserAgreement); }

  async recordAgreement(
    data: {
      user_id: string;
      student_id?: string | null;
      agreement_type: string;
      agreement_version: string;
      document_name: string;
      document_hash: string;
      document_object_key?: string | null;
      ip_address?: string | null;
      user_agent?: string | null;
      signature_data?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<UserAgreement> {
    return this.model.create(
      {
        ...data,
        accepted_at: new Date(),
      },
      { transaction: options.transaction }
    );
  }

  async hasUserAgreed(
    user_id: string,
    agreement_type: string,
    min_version?: string
  ): Promise<boolean> {
    const agreement = await this.model.findOne({
      where: {
        user_id,
        agreement_type,
        ...(min_version ? { agreement_version: min_version } : {}),
      },
      order: [["accepted_at", "DESC"]],
    });
    return Boolean(agreement);
  }

  async getLatestAgreement(
    user_id: string,
    agreement_type: string
  ): Promise<UserAgreement | null> {
    return this.model.findOne({
      where: { user_id, agreement_type },
      order: [["accepted_at", "DESC"]],
    });
  }
}

export class ArtifactAttestationService extends CreateReadService<ArtifactAttestation> {
  constructor() { super(ArtifactAttestation); }

  async createAttestation(
    data: {
      artifact_type: string;
      artifact_id: string;
      artifact_hash: string;
      signature: string;
      signer_user_id?: string | null;
      signer_public_key_fingerprint?: string | null;
      hash_algorithm?: string;
      metadata?: Record<string, unknown>;
    },
    options: MutationOptions = {}
  ): Promise<ArtifactAttestation> {
    return this.model.create(
      {
        ...data,
        hash_algorithm: data.hash_algorithm ?? "SHA-256",
        attested_at: new Date(),
      },
      { transaction: options.transaction }
    );
  }

  async verifyAttestation(
    artifact_type: string,
    artifact_id: string,
    expected_hash: string
  ): Promise<{ verified: boolean; attestation: ArtifactAttestation | null }> {
    const attestation = await this.model.findOne({
      where: { artifact_type, artifact_id },
      order: [["attested_at", "DESC"]],
    });

    if (!attestation) {
      return { verified: false, attestation: null };
    }

    return {
      verified: attestation.artifact_hash === expected_hash,
      attestation,
    };
  }
}

