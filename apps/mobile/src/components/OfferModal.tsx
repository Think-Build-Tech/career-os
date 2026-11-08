// apps/mobile/src/components/OfferModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { PlacementOffer } from '../types/student.types';
import { CloseIcon, CheckIcon, ShieldCheckIcon, AwardIcon } from './Icons';

interface OfferModalProps {
  visible: boolean;
  offer: PlacementOffer | null;
  onClose: () => void;
  onAcceptOffer: (offerId: string) => Promise<void>;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  visible,
  offer,
  onClose,
  onAcceptOffer,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [signedName, setSignedName] = useState('Aarav Sharma');
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  if (!offer) return null;

  const handleAccept = async () => {
    setSubmitting(true);
    await onAcceptOffer(offer.id);
    setSubmitting(false);
    setAcceptedSuccess(true);
    setTimeout(() => {
      setAcceptedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>Official Job Offer</Text>
              <Text style={styles.title}>{offer.companyName}</Text>
              <Text style={styles.subtitle}>{offer.roleTitle}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <CloseIcon size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {acceptedSuccess ? (
              <View style={styles.successState}>
                <View style={styles.successCircle}>
                  <CheckIcon size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Offer Durably Accepted! 🎉</Text>
                <Text style={styles.successSub}>
                  Congratulations Aarav! Your signed employment agreement and cryptographic signature have been recorded in the institution placement ledger.
                </Text>
              </View>
            ) : (
              <>
                {/* Total CTC Highlight Banner */}
                <View style={styles.ctcBanner}>
                  <View style={styles.ctcBannerLeft}>
                    <Text style={styles.ctcBannerLabel}>TOTAL COMPENSATED CTC</Text>
                    <Text style={styles.ctcBannerValue}>₹{(offer.totalCtc / 100000).toFixed(2)} LPA</Text>
                    <Text style={styles.ctcBannerTier}>{offer.tierLabel}</Text>
                  </View>
                  <AwardIcon size={36} color="#F59E0B" />
                </View>

                {/* Compensation Breakdown Grid */}
                <Text style={styles.sectionTitle}>Salary Structure & Benefits</Text>
                <View style={styles.breakdownTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Base Fixed Salary</Text>
                    <Text style={styles.tableValue}>₹{(offer.baseSalary / 100000).toFixed(2)} LPA</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Joining & Relocation Bonus</Text>
                    <Text style={styles.tableValue}>₹{(offer.joiningBonus / 100000).toFixed(2)} LPA</Text>
                  </View>
                  <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.tableLabel}>Performance Variable Pay</Text>
                    <Text style={styles.tableValue}>₹{(offer.variablePay / 100000).toFixed(2)} LPA</Text>
                  </View>
                </View>

                {/* Offer Letter Evidence Details */}
                <View style={styles.evidenceCard}>
                  <ShieldCheckIcon size={18} color="#4F46E5" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.evidenceTitle}>Verified Document Reference</Text>
                    <Text style={styles.evidenceCode}>ID: {offer.offerCode}</Text>
                    <Text style={styles.evidenceSub}>SHA-256 Attested by Training & Placement Cell</Text>
                  </View>
                </View>

                {/* Signature Input */}
                <Text style={styles.sectionTitle}>Digital Student Acceptance</Text>
                <Text style={styles.signSub}>
                  By typing your full legal name below, you execute a legally binding agreement in accordance with the college placement rules.
                </Text>
                <TextInput
                  style={styles.signInput}
                  value={signedName}
                  onChangeText={setSignedName}
                  placeholder="Type full legal name"
                />

                {/* Actions */}
                <View style={styles.actionBlock}>
                  <TouchableOpacity
                    style={[styles.acceptBtn, (!signedName.trim() || submitting) && styles.disabledBtn]}
                    onPress={handleAccept}
                    disabled={!signedName.trim() || submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.acceptBtnText}>Accept & Sign Offer Letter ✍️</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.declineBtn} onPress={onClose} disabled={submitting}>
                    <Text style={styles.declineBtnText}>Request 48hr Extension</Text>
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
    color: '#10B981',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
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
  ctcBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  ctcBannerLeft: {
    flex: 1,
  },
  ctcBannerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A5B4FC',
    letterSpacing: 0.5,
  },
  ctcBannerValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  ctcBannerTier: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FCD34D',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  breakdownTable: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  tableValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  evidenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  evidenceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
  },
  evidenceCode: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#4F46E5',
    fontWeight: '700',
  },
  evidenceSub: {
    fontSize: 10,
    color: '#6366F1',
    marginTop: 1,
  },
  signSub: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  signInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
  actionBlock: {
    gap: 10,
  },
  acceptBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#A7F3D0',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  declineBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  declineBtnText: {
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
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
});
