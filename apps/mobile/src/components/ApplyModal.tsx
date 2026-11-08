// apps/mobile/src/components/ApplyModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { JobOpportunity, StudentProfile } from '../types/student.types';
import { CloseIcon, CheckIcon, ShieldCheckIcon, ClockIcon } from './Icons';

interface ApplyModalProps {
  visible: boolean;
  job: JobOpportunity | null;
  student: StudentProfile;
  onClose: () => void;
  onConfirmApply: (jobId: string) => Promise<void>;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  visible,
  job,
  student,
  onClose,
  onConfirmApply,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!job) return null;

  const handleApply = async () => {
    setSubmitting(true);
    await onConfirmApply(job.id);
    setSubmitting(false);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>{job.companyName}</Text>
              <Text style={styles.title}>{job.title}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <CloseIcon size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {appliedSuccess ? (
              <View style={styles.successState}>
                <View style={styles.successCircle}>
                  <CheckIcon size={36} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Application Submitted!</Text>
                <Text style={styles.successSub}>
                  Your verified student record and locked resume have been bound to {job.companyName}.
                </Text>
              </View>
            ) : (
              <>
                {/* CTC & Work Mode Row */}
                <View style={styles.badgeRow}>
                  <View style={styles.ctcBadge}>
                    <Text style={styles.ctcText}>{job.ctcLabel}</Text>
                  </View>
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierText}>{job.tierLabel}</Text>
                  </View>
                  <View style={styles.modeBadge}>
                    <Text style={styles.modeText}>📍 {job.location}</Text>
                  </View>
                </View>

                {/* Eligibility Verification Card */}
                <View style={styles.verifiedCard}>
                  <View style={styles.cardHeadRow}>
                    <ShieldCheckIcon size={20} color="#10B981" />
                    <Text style={styles.verifiedTitle}>Pre-Screen Eligibility Passed</Text>
                  </View>
                  <Text style={styles.verifiedSub}>
                    Verified SPPU Academic Record: CGPA {student.cgpa} · {student.activeBacklogs} Active Backlogs
                  </Text>
                  <View style={styles.checklistRow}>
                    <Text style={styles.checkItem}>✓ Institutional CGPA threshold satisfied (8.5+)</Text>
                    <Text style={styles.checkItem}>✓ Zero live backlogs requirement verified</Text>
                    <Text style={styles.checkItem}>✓ No placement compliance strikes recorded (0/2)</Text>
                  </View>
                </View>

                {/* Locked Resume Binding */}
                <Text style={styles.sectionLabel}>Locked Resume for Drive</Text>
                <View style={styles.resumeCard}>
                  <Text style={styles.resumeIcon}>📄</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resumeName}>Aarav_Sharma_Backend_2026_v3.pdf</Text>
                    <Text style={styles.resumeMeta}>ATS Score: 88/100 · Verified & Attested</Text>
                  </View>
                </View>

                {/* Drive Selection Pipeline */}
                <Text style={styles.sectionLabel}>Hiring Rounds & Schedule</Text>
                {job.rounds.map((r) => (
                  <View key={r.roundNumber} style={styles.roundItem}>
                    <View style={styles.roundNumCircle}>
                      <Text style={styles.roundNumText}>{r.roundNumber}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.roundTitle}>{r.title}</Text>
                      <Text style={styles.roundDesc}>{r.description}</Text>
                    </View>
                  </View>
                ))}

                {/* Institutional Notice */}
                <View style={styles.policyNotice}>
                  <ClockIcon size={14} color="#6B7280" />
                  <Text style={styles.policyText}>
                    Applying commits your participation. Mandatory attendance policy applies to all interview rounds.
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.footActions}>
                  <TouchableOpacity
                    style={[styles.applyBtn, submitting && styles.disabledBtn]}
                    onPress={handleApply}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.applyBtnText}>Confirm & Apply with 1-Click 🚀</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={submitting}>
                    <Text style={styles.cancelBtnText}>Review Later</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  ctcBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ctcText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  tierBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  modeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  verifiedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  cardHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  verifiedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  verifiedSub: {
    fontSize: 12,
    color: '#15803D',
    marginBottom: 8,
  },
  checklistRow: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: 8,
  },
  checkItem: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 4,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resumeIcon: {
    fontSize: 22,
  },
  resumeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  resumeMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  roundItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  roundNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  roundNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  roundTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  roundDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  policyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  policyText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
    lineHeight: 15,
  },
  footActions: {
    gap: 10,
  },
  applyBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#818CF8',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
