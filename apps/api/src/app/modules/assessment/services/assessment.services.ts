import { Transaction } from "sequelize";
import { sequelize } from "../../../config/database";
import { CreateReadService, CrudService, MutableService, MutationOptions } from "../../services";
import { EntityNotFoundError, InvalidServiceInputError } from "../../services/service.errors";
import {
  Assessment,
  AssessmentAssignment,
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentResponse,
  AssessmentSlot,
  AssessmentSlotBooking,
  BadgeDefinition,
  ProctorEvent,
  ProctorPreflight,
  ProctorSession,
  StudentBadge,
} from "../models";

export class AssessmentService extends CrudService<Assessment> {
  constructor() { super(Assessment); }
}
export class AssessmentQuestionService extends CrudService<AssessmentQuestion> {
  constructor() { super(AssessmentQuestion); }
}
export class AssessmentAssignmentService extends CrudService<AssessmentAssignment> {
  constructor() { super(AssessmentAssignment); }
}
export class AssessmentAttemptService extends MutableService<AssessmentAttempt> {
  constructor() { super(AssessmentAttempt); }
}
export class AssessmentResponseService extends MutableService<AssessmentResponse> {
  constructor() { super(AssessmentResponse); }
}
export class ProctorSessionService extends MutableService<ProctorSession> {
  constructor() { super(ProctorSession); }
}
export class ProctorEventService extends CreateReadService<ProctorEvent> {
  constructor() { super(ProctorEvent); }
}
export class BadgeDefinitionService extends CrudService<BadgeDefinition> {
  constructor() { super(BadgeDefinition); }
}
export class StudentBadgeService extends MutableService<StudentBadge> {
  constructor() { super(StudentBadge); }
}

export class AssessmentSlotService extends CrudService<AssessmentSlot> {
  constructor() { super(AssessmentSlot); }

  async bookSlot(
    slotId: string,
    studentId: string,
    existingTransaction?: Transaction
  ): Promise<AssessmentSlotBooking> {
    const execute = async (t: Transaction): Promise<AssessmentSlotBooking> => {
      const slot = await AssessmentSlot.findByPk(slotId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!slot) {
        throw new InvalidServiceInputError("Assessment slot not found");
      }

      if (slot.status !== "OPEN" || slot.booked_count >= slot.capacity) {
        throw new InvalidServiceInputError("Assessment slot is fully booked or closed");
      }

      const existingBooking = await AssessmentSlotBooking.findOne({
        where: { slot_id: slotId, student_id: studentId },
        transaction: t,
      });

      if (existingBooking) {
        if (existingBooking.status === "CONFIRMED") {
          return existingBooking;
        }
        existingBooking.status = "CONFIRMED";
        await existingBooking.save({ transaction: t });
        return existingBooking;
      }

      slot.booked_count += 1;
      if (slot.booked_count >= slot.capacity) {
        slot.status = "FULL";
      }
      await slot.save({ transaction: t });

      return AssessmentSlotBooking.create(
        {
          slot_id: slotId,
          student_id: studentId,
          status: "CONFIRMED",
        },
        { transaction: t }
      );
    };

    if (existingTransaction) {
      return execute(existingTransaction);
    }
    return sequelize.transaction(execute);
  }

  async cancelBooking(
    slotId: string,
    studentId: string,
    options: MutationOptions = {}
  ): Promise<AssessmentSlotBooking> {
    const execute = async (t: Transaction) => {
      const booking = await AssessmentSlotBooking.findOne({
        where: { slot_id: slotId, student_id: studentId },
        transaction: t,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!booking) {
        throw new EntityNotFoundError("AssessmentSlotBooking", `${slotId}:${studentId}`);
      }

      if (booking.status === "CANCELLED") {
        return booking;
      }

      booking.status = "CANCELLED";
      await booking.save({ transaction: t });

      const slot = await this.model.findByPk(slotId, {
        transaction: t,
        lock: Transaction.LOCK.UPDATE,
      });
      if (slot) {
        slot.booked_count = Math.max(0, slot.booked_count - 1);
        if (slot.status === "FULL") {
          slot.status = "OPEN";
        }
        await slot.save({ transaction: t });
      }

      return booking;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }
}

export class AssessmentSlotBookingService extends MutableService<AssessmentSlotBooking> {
  constructor() { super(AssessmentSlotBooking); }
}

export class ProctorPreflightService extends CreateReadService<ProctorPreflight> {
  constructor() { super(ProctorPreflight); }

  async recordPreflight(
    data: {
      student_id: string;
      assessment_id: string;
      camera_passed?: boolean;
      microphone_passed?: boolean;
      network_passed?: boolean;
      browser_passed?: boolean;
      display_passed?: boolean;
      identity_verified?: boolean;
      system_info?: Record<string, unknown>;
    },
    options: MutationOptions = {}
  ): Promise<ProctorPreflight> {
    return this.model.create(
      {
        student_id: data.student_id,
        assessment_id: data.assessment_id,
        camera_passed: data.camera_passed ?? false,
        microphone_passed: data.microphone_passed ?? false,
        network_passed: data.network_passed ?? false,
        browser_passed: data.browser_passed ?? false,
        display_passed: data.display_passed ?? false,
        identity_verified: data.identity_verified ?? false,
        system_info: data.system_info ?? {},
        completed_at: new Date(),
      },
      { transaction: options.transaction }
    );
  }

  async isPreflightComplete(student_id: string, assessment_id: string): Promise<boolean> {
    const preflight = await this.model.findOne({
      where: {
        student_id,
        assessment_id,
        camera_passed: true,
        microphone_passed: true,
        network_passed: true,
        browser_passed: true,
        display_passed: true,
        identity_verified: true,
      },
      order: [["completed_at", "DESC"]],
    });
    return Boolean(preflight);
  }
}

