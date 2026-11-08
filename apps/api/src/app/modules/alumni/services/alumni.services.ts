import { Transaction } from "sequelize";
import { sequelize } from "../../../config/database";
import { CrudService, MutableService, MutationOptions } from "../../services";
import { InvalidServiceInputError } from "../../services/service.errors";
import {
  AlumniConnectionRequest,
  AlumniEmployment,
  AlumniProfile,
  MentorshipAvailabilitySlot,
  MentorshipBooking,
  ReferralPost,
  ReferralRequest,
} from "../models";

export class AlumniProfileService extends CrudService<AlumniProfile> {
  constructor() { super(AlumniProfile); }
}
export class AlumniEmploymentService extends CrudService<AlumniEmployment> {
  constructor() { super(AlumniEmployment); }
}
export class ReferralPostService extends CrudService<ReferralPost> {
  constructor() { super(ReferralPost); }
}
export class ReferralRequestService extends MutableService<ReferralRequest> {
  constructor() { super(ReferralRequest); }
}
export class AlumniConnectionRequestService extends MutableService<AlumniConnectionRequest> {
  constructor() { super(AlumniConnectionRequest); }
}

export class MentorshipAvailabilitySlotService extends CrudService<MentorshipAvailabilitySlot> {
  constructor() { super(MentorshipAvailabilitySlot); }
}

export class MentorshipBookingService extends MutableService<MentorshipBooking> {
  constructor() { super(MentorshipBooking); }

  async bookSlot(
    slotId: string,
    studentId: string,
    notes?: string,
    existingTransaction?: Transaction
  ): Promise<MentorshipBooking> {
    const execute = async (t: Transaction): Promise<MentorshipBooking> => {
      const slot = await MentorshipAvailabilitySlot.findByPk(slotId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!slot) {
        throw new InvalidServiceInputError("Mentorship availability slot not found");
      }

      if (slot.is_booked || slot.status !== "AVAILABLE") {
        throw new InvalidServiceInputError("Mentorship slot has already been booked or is unavailable");
      }

      const existingBooking = await MentorshipBooking.findOne({
        where: { slot_id: slotId },
        transaction: t,
      });

      if (existingBooking) {
        throw new InvalidServiceInputError("Mentorship slot already has an active booking");
      }

      slot.is_booked = true;
      slot.status = "BOOKED";
      await slot.save({ transaction: t });

      return MentorshipBooking.create(
        {
          slot_id: slotId,
          student_id: studentId,
          alumni_id: slot.alumni_id,
          status: "SCHEDULED",
          notes: notes ?? null,
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
    bookingId: string,
    options: MutationOptions = {}
  ): Promise<MentorshipBooking> {
    const execute = async (t: Transaction) => {
      const booking = await this.requireById(bookingId, { transaction: t });
      if (booking.status === "CANCELLED") {
        return booking;
      }

      booking.status = "CANCELLED";
      await booking.save({ transaction: t });

      const slot = await MentorshipAvailabilitySlot.findByPk(booking.slot_id, {
        transaction: t,
        lock: Transaction.LOCK.UPDATE,
      });
      if (slot) {
        slot.is_booked = false;
        slot.status = "AVAILABLE";
        await slot.save({ transaction: t });
      }

      return booking;
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  async completeBooking(
    bookingId: string,
    feedback?: { student_feedback?: string; alumni_feedback?: string },
    options: MutationOptions = {}
  ): Promise<MentorshipBooking> {
    const booking = await this.requireById(bookingId, { transaction: options.transaction });
    booking.status = "COMPLETED";
    if (feedback?.student_feedback) {
      booking.student_feedback = feedback.student_feedback;
    }
    if (feedback?.alumni_feedback) {
      booking.alumni_feedback = feedback.alumni_feedback;
    }
    return booking.save({ transaction: options.transaction });
  }
}

