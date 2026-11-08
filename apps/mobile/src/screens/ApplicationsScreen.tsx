// apps/mobile/src/screens/ApplicationsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  StudentApplication,
  PlacementOffer,
  PlacementCompliance,
} from '../types/student.types';
import {
  BuildingIcon,
  ClockIcon,
  CheckIcon,
  ShieldCheckIcon,
  AwardIcon,
  SparklesIcon,
} from '../components/Icons';

interface ApplicationsScreenProps {
  applications: StudentApplication[];
  offers: PlacementOffer[];
  compliance: PlacementCompliance;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenOfferModal: (offer: PlacementOffer) => void;
  onPrepWithTacie: (app: StudentApplication) => void;
}

type TabType = 'PIPELINE' | 'OFFERS' | 'COMPLIANCE';

export const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({
  applications,
  offers,
  compliance,
  isRefreshing,
  onRefresh,
  onOpenOfferModal,
  onPrepWithTacie,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('PIPELINE');

  const pendingOffersCount = offers.filter((o) => o.status === 'PENDING').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'SELECTED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
      case 'SHORTLISTED_FOR_INTERVIEW':
      case 'INTERVIEW_SCHEDULED':
      case 'Technical Round 1 Scheduled':
        return { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' };
      case 'TECHNICAL_OA':
      case 'UNDER_REVIEW':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'REJECTED':
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const formatStatus = (s: string) => {
    return s.replace(/_/g, ' ');
  };

  return (
    <View style={styles.container}>
      {/* Top Segmented Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'PIPELINE' && styles.activeTabItem]}
          onPress={() => setActiveTab('PIPELINE')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabItemText, activeTab === 'PIPELINE' && styles.activeTabItemText]}>
            Active Pipeline ({applications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'OFFERS' && styles.activeTabItem]}
          onPress={() => setActiveTab('OFFERS')}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.tabItemText, activeTab === 'OFFERS' && styles.activeTabItemText]}>
              Offers ({offers.length})
            </Text>
            {pendingOffersCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{pendingOffersCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'COMPLIANCE' && styles.activeTabItem]}
          onPress={() => setActiveTab('COMPLIANCE')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabItemText, activeTab === 'COMPLIANCE' && styles.activeTabItemText]}>
            Policy & Rules
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
      >
        {/* TAB 1: ACTIVE PIPELINE */}
        {activeTab === 'PIPELINE' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Application Multi-Round Stepper</Text>
              <Text style={styles.sectionSubtitle}>
                Live tracking from college recruitment drives
              </Text>
            </View>

            {applications.map((app) => {
              const displayStatus = app.currentStageLabel || app.status || 'Applied';
              const statusStyle = getStatusColor(displayStatus);
              const jobRole = app.roleTitle || app.jobTitle || 'Software Engineer';
              const appliedDate = app.appliedDate || app.appliedAt || 'Recent';

              return (
                <View key={app.id} style={styles.appCard}>
                  {/* Top Bar */}
                  <View style={styles.appHeaderRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <View style={styles.companyRow}>
                        <BuildingIcon size={14} color="#4F46E5" />
                        <Text style={styles.companyName}>{app.companyName}</Text>
                      </View>
                      <Text style={styles.jobRoleText}>{jobRole}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {formatStatus(displayStatus)}
                      </Text>
                    </View>
                  </View>

                  {/* Compensation & Drive Meta */}
                  <View style={styles.metaRow}>
                    <Text style={styles.metaCtc}>{app.ctcLabel}</Text>
                    <Text style={styles.metaDot}>&bull;</Text>
                    <Text style={styles.metaDate}>
                      Applied {appliedDate}
                    </Text>
                  </View>

                  {/* Multi-Round Stepper Visualizer */}
                  {app.rounds && app.rounds.length > 0 && (
                    <View style={styles.stepperContainer}>
                      <Text style={styles.stepperHeader}>SELECTION PROGRESS</Text>
                      <View style={styles.stepperRow}>
                        {app.rounds.map((round, idx) => {
                          const isDone = round.status === 'COMPLETED';
                          const isCurrent = round.status === 'CURRENT' || round.status === 'IN_PROGRESS';

                          return (
                            <View key={round.id || idx} style={styles.stepItem}>
                              <View style={[
                                styles.stepCircle,
                                isDone && styles.stepDoneCircle,
                                isCurrent && styles.stepCurrentCircle,
                              ]}>
                                {isDone ? (
                                  <CheckIcon size={12} color="#FFFFFF" />
                                ) : (
                                  <Text style={[
                                    styles.stepNumText,
                                    isCurrent && styles.stepCurrentNumText,
                                  ]}>
                                    {idx + 1}
                                  </Text>
                                )}
                              </View>
                              <Text style={[
                                styles.stepLabel,
                                (isDone || isCurrent) && styles.stepActiveLabel,
                              ]} numberOfLines={1}>
                                {round.title || round.name}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Next Step Schedule Notice */}
                  {app.nextStepSchedule ? (
                    <View style={styles.scheduleBox}>
                      <ClockIcon size={14} color="#4338CA" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.scheduleText}>{app.nextStepSchedule}</Text>
                      </View>
                    </View>
                  ) : null}

                  {/* Bound Resume Pill & TACIE Prep CTA */}
                  <View style={styles.appFooter}>
                    <View style={styles.resumePill}>
                      <Text style={styles.resumePillText}>
                        📄 {app.lockedResumeTitle || app.resumeVersionName || 'Aarav_Sharma_Resume.pdf'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.prepBtn}
                      onPress={() => onPrepWithTacie(app)}
                      activeOpacity={0.7}
                    >
                      <SparklesIcon size={14} color="#4F46E5" />
                      <Text style={styles.prepBtnText}>Prep Interview</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: OFFERS */}
        {activeTab === 'OFFERS' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Institutional Placement Offers</Text>
              <Text style={styles.sectionSubtitle}>
                Formal offer letters verified by College Training & Placement Cell
              </Text>
            </View>

            {offers.map((offer) => {
              const isAccepted = offer.status === 'ACCEPTED';
              const roleTitle = offer.roleTitle || offer.jobTitle || 'Graduate Trainee';
              const location = offer.location || 'Pune / Mumbai';
              const ctcText = offer.ctcLabel || `₹${(offer.totalCtc / 100000).toFixed(1)} LPA`;
              const bonus = offer.joiningBonus || offer.performanceBonus;
              const deadline = offer.expiresAt || offer.deadline;

              return (
                <View key={offer.id} style={styles.offerCard}>
                  {/* Top Bar */}
                  <View style={styles.offerTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.companyRow}>
                        <BuildingIcon size={14} color="#4F46E5" />
                        <Text style={styles.companyName}>{offer.companyName}</Text>
                      </View>
                      <Text style={styles.offerRoleText}>{roleTitle}</Text>
                      <Text style={styles.offerLocationText}>📍 {location}</Text>
                    </View>

                    <View style={styles.ctcHighlightBox}>
                      <Text style={styles.ctcLargeText}>{ctcText}</Text>
                      <Text style={styles.ctcPeriodText}>Annual Gross</Text>
                    </View>
                  </View>

                  {/* CTC Component Breakdown */}
                  <View style={styles.breakdownContainer}>
                    <Text style={styles.breakdownTitle}>COMPENSATION BREAKDOWN</Text>
                    <View style={styles.breakdownGrid}>
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Fixed Base</Text>
                        <Text style={styles.breakdownVal}>₹{(offer.baseSalary / 100000).toFixed(1)} LPA</Text>
                      </View>
                      {bonus ? (
                        <View style={styles.breakdownItem}>
                          <Text style={styles.breakdownLabel}>Joining Bonus</Text>
                          <Text style={styles.breakdownVal}>₹{(bonus / 100000).toFixed(1)} LPA</Text>
                        </View>
                      ) : null}
                      {offer.variablePay ? (
                        <View style={styles.breakdownItem}>
                          <Text style={styles.breakdownLabel}>Variable Pay</Text>
                          <Text style={styles.breakdownVal}>₹{(offer.variablePay / 100000).toFixed(1)} LPA</Text>
                        </View>
                      ) : null}
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Joining Date</Text>
                        <Text style={styles.breakdownVal}>July 2026</Text>
                      </View>
                    </View>
                  </View>

                  {/* Verification & Acceptance Status */}
                  {isAccepted ? (
                    <View style={styles.acceptedNotice}>
                      <View style={styles.acceptedCheck}>
                        <CheckIcon size={16} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.acceptedTitle}>Offer Formally Accepted</Text>
                        <Text style={styles.acceptedRef}>
                          Ref: {offer.signatureReference || offer.signedDocumentKey || 'DOCUSIGN_ENV_891278'} &bull; Locked in ERP
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.pendingActionBox}>
                      <View style={styles.expiryRow}>
                        <ClockIcon size={14} color="#D97706" />
                        <Text style={styles.expiryText}>
                          Acceptance window expires on {new Date(deadline).toLocaleDateString()}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.reviewAcceptBtn}
                        onPress={() => onOpenOfferModal(offer)}
                        activeOpacity={0.7}
                      >
                        <AwardIcon size={16} color="#FFFFFF" />
                        <Text style={styles.reviewAcceptBtnText}>Review & Formally Accept Offer</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 3: COMPLIANCE & POLICY */}
        {activeTab === 'COMPLIANCE' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>College Placement Regulations</Text>
              <Text style={styles.sectionSubtitle}>
                Institutional compliance policies & debarment safeguards
              </Text>
            </View>

            {/* Strikes Standing Card */}
            <View style={styles.complianceCard}>
              <View style={styles.complianceHeaderRow}>
                <View>
                  <Text style={styles.complianceCardTitle}>Placement Debarment Standing</Text>
                  <Text style={styles.complianceCardSubtitle}>Monitored automatically by Placement Cell</Text>
                </View>
                <View style={styles.strikeCountPill}>
                  <Text style={styles.strikeCountText}>
                    {compliance.activeStrikes} / {compliance.maxAllowedStrikes} Strikes
                  </Text>
                </View>
              </View>

              <View style={styles.standingBanner}>
                <ShieldCheckIcon size={18} color="#047857" />
                <Text style={styles.standingBannerText}>
                  {compliance.isDebarred
                    ? '⚠️ Your account is currently debarred from campus drives.'
                    : '✓ Exemplary Standing. You are fully eligible for all eligible tier drives.'}
                </Text>
              </View>
            </View>

            {/* Institutional Policies Checklist */}
            <View style={styles.rulesCard}>
              <Text style={styles.rulesCardHeader}>MANDATORY RULES & GUIDELINES</Text>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>1️⃣</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ruleHeading}>One Dream Offer Policy</Text>
                  <Text style={styles.ruleBody}>
                    Once a student receives an offer in the "Dream" tier (₹10L+), they are eligible to apply only for "Super Dream" companies (₹18L+).
                  </Text>
                </View>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>2️⃣</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ruleHeading}>Mandatory Drive Attendance</Text>
                  <Text style={styles.ruleBody}>
                    Students registering for a campus drive must attend all test and interview rounds. Unexcused absence will incur 1 placement strike.
                  </Text>
                </View>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>3️⃣</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ruleHeading}>Off-Campus NOC Protocol</Text>
                  <Text style={styles.ruleBody}>
                    Applying to off-campus internships requires a formal NOC request via CareerOS. NOCs are issued within 24 hours of TPO verification.
                  </Text>
                </View>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>4️⃣</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ruleHeading}>Digital Offer Acceptance</Text>
                  <Text style={styles.ruleBody}>
                    Acceptance via CareerOS generates an immutable digital signature hash recorded in the college placement ledger.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#4F46E5',
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabItemText: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  tabBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  appHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  jobRoleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  metaCtc: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaDot: {
    color: '#CBD5E1',
  },
  metaDate: {
    fontSize: 11,
    color: '#64748B',
  },
  stepperContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepperHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDoneCircle: {
    backgroundColor: '#10B981',
  },
  stepCurrentCircle: {
    backgroundColor: '#4F46E5',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  stepNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  stepCurrentNumText: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepActiveLabel: {
    color: '#0F172A',
    fontWeight: '700',
  },
  scheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#312E81',
  },
  appFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  resumePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resumePillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  prepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  prepBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  offerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  offerRoleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  offerLocationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ctcHighlightBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'flex-end',
  },
  ctcLargeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  ctcPeriodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  breakdownContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakdownItem: {
    flex: 1,
    minWidth: 90,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  acceptedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
  },
  acceptedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  acceptedRef: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 1,
  },
  pendingActionBox: {
    gap: 10,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
  },
  expiryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  reviewAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
  },
  reviewAcceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  complianceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  complianceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  complianceCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  complianceCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  strikeCountPill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  strikeCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  standingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 10,
  },
  standingBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    flex: 1,
  },
  rulesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  rulesCardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  ruleBullet: {
    fontSize: 14,
  },
  ruleHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  ruleBody: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
