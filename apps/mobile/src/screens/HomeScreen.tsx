// apps/mobile/src/screens/HomeScreen.tsx

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
  StudentProfile,
  StudentActionItem,
  PlacementCompliance,
  SkillGapAnalysis,
  AcademicEvent,
  JobOpportunity,
  StudentNavTab,
} from '../types/student.types';
import {
  ShieldCheckIcon,
  ClockIcon,
  CheckIcon,
  ChevronRightIcon,
  AwardIcon,
  SparklesIcon,
} from '../components/Icons';

interface HomeScreenProps {
  student: StudentProfile;
  actions: StudentActionItem[];
  compliance: PlacementCompliance;
  skillGap: SkillGapAnalysis;
  events: AcademicEvent[];
  priorityJobs: JobOpportunity[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: StudentNavTab) => void;
  onCompleteSla: (actionId: string) => void;
  onOpenApplyModal: (job: JobOpportunity) => void;
  onSwitchBenchmark: (role: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  student,
  actions,
  compliance,
  skillGap,
  events,
  priorityJobs,
  isRefreshing,
  onRefresh,
  onNavigateTab,
  onCompleteSla,
  onOpenApplyModal,
  onSwitchBenchmark,
}) => {
  const [selectedRole, setSelectedRole] = useState(skillGap.targetRole || 'Backend Cloud Engineer');
  const pendingActions = actions.filter((a) => !a.completedAt);
  const firstName = student.name.split(' ')[0] || 'Student';

  const roleBenchmarks = [
    { label: 'Backend Eng', roleName: 'Backend Cloud Engineer' },
    { label: 'Full-Stack', roleName: 'Full-Stack Systems Engineer' },
    { label: 'Cloud / SRE', roleName: 'Cloud SRE Engineer' },
  ];

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);
    onSwitchBenchmark(roleName);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
    >
      {/* Student Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingText}>Good day, {firstName} 👋</Text>
            <Text style={styles.subGreeting}>
              {student.degree} &bull; {student.batchYear} Batch
            </Text>
            <Text style={styles.campusTag}>🏫 {student.collegeName}</Text>
          </View>
          <View style={styles.cgpaBadge}>
            <Text style={styles.cgpaNum}>{student.cgpa}</Text>
            <Text style={styles.cgpaLabel}>CGPA</Text>
          </View>
        </View>

        {/* Quick Shortcut Buttons */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => onNavigateTab('tacie')}
            activeOpacity={0.7}
          >
            <SparklesIcon size={16} color="#4F46E5" />
            <Text style={styles.quickActionText}>Prep with TACIE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => onNavigateTab('jobs')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 13 }}>💼</Text>
            <Text style={styles.quickActionText}>Explore Drives</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PRIORITY SLA ACTION QUEUE (Dark Theme matching Web) */}
      <View style={styles.slaContainer}>
        <View style={styles.slaHeadRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.slaTitle}>Priority Placement SLA Queue</Text>
            <Text style={styles.slaSubtitle}>
              {pendingActions.length} pending time-sensitive institutional action{pendingActions.length === 1 ? '' : 's'}
            </Text>
          </View>
          <View style={styles.strikeBadge}>
            <Text style={styles.strikeText}>
              {compliance.activeStrikes}/{compliance.maxAllowedStrikes} Strikes
            </Text>
          </View>
        </View>

        {pendingActions.length > 0 ? (
          pendingActions.map((item) => (
            <View key={item.id} style={styles.slaItemCard}>
              <View style={styles.slaItemTop}>
                <Text style={styles.slaItemTitle}>{item.title}</Text>
                <View style={styles.slaDuePill}>
                  <ClockIcon size={12} color="#F59E0B" />
                  <Text style={styles.slaDueText}>Due Today</Text>
                </View>
              </View>
              {item.subtitle ? <Text style={styles.slaItemSub}>{item.subtitle}</Text> : null}

              <View style={styles.slaBtnRow}>
                <TouchableOpacity
                  style={styles.slaPrepBtn}
                  onPress={() => onNavigateTab('tacie')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.slaPrepBtnText}>Prep with TACIE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.slaCompleteBtn}
                  onPress={() => onCompleteSla(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.slaCompleteBtnText}>Confirm & Complete ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptySlaCard}>
            <CheckIcon size={18} color="#10B981" />
            <Text style={styles.emptySlaText}>Zero pending SLA placement actions in queue.</Text>
          </View>
        )}
      </View>

      {/* CAREER READINESS & SKILL GAP */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.cardTitle}>Career Readiness</Text>
              <View style={styles.percentileBadge}>
                <Text style={styles.percentileText}>{skillGap.cohortPercentile}</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>{skillGap.benchmarkSummary}</Text>
          </View>
          <View style={styles.readinessCircle}>
            <Text style={styles.readinessNum}>{skillGap.overallReadiness}%</Text>
            <Text style={styles.readinessLabel}>Match</Text>
          </View>
        </View>

        {/* Role Selector Tabs */}
        <View style={styles.roleTabsRow}>
          {roleBenchmarks.map((r) => (
            <TouchableOpacity
              key={r.label}
              style={[styles.roleTab, selectedRole === r.roleName && styles.activeRoleTab]}
              onPress={() => handleRoleSelect(r.roleName)}
              activeOpacity={0.7}
            >
              <Text style={[styles.roleTabText, selectedRole === r.roleName && styles.activeRoleTabText]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skill Bars */}
        <View style={styles.skillsList}>
          {skillGap.breakdown.map((b) => {
            const barColor = b.scorePercentage >= 90 ? '#10B981' : b.scorePercentage >= 80 ? '#4F46E5' : '#F59E0B';
            return (
              <View key={b.label} style={styles.skillBarItem}>
                <View style={styles.skillBarMeta}>
                  <Text style={styles.skillBarLabel}>{b.label}</Text>
                  <Text style={styles.skillBarScore}>{b.scorePercentage}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${b.scorePercentage}%`, backgroundColor: barColor }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* High-ROI Recommended Action */}
        {skillGap.highestRoiAction && (
          <View style={styles.roiCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roiTitle}>🎯 {skillGap.highestRoiAction.title}</Text>
              <Text style={styles.roiSub}>{skillGap.highestRoiAction.subtitle}</Text>
            </View>
            <TouchableOpacity
              style={styles.roiBtn}
              onPress={() => onNavigateTab('tacie')}
              activeOpacity={0.7}
            >
              <Text style={styles.roiBtnText}>Start Test</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SCHEDULE & ERP CONFLICT CHECK */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Academic Schedule & Exam Conflict Check</Text>
            <Text style={styles.cardSubtitle}>Directly integrated with College Exam Cell</Text>
          </View>
          <View style={styles.verifiedConflictBadge}>
            <Text style={styles.verifiedConflictText}>0 Conflicts</Text>
          </View>
        </View>

        <View style={styles.timetableNotice}>
          <ShieldCheckIcon size={16} color="#10B981" />
          <Text style={styles.timetableNoticeText}>
            ✓ Registrar Timetable: No upcoming lab exams clash with your interview drives.
          </Text>
        </View>

        {events.map((ev) => (
          <View key={ev.id} style={styles.eventRow}>
            <View style={styles.eventDateBadge}>
              <Text style={styles.eventDateText}>
                {new Date(ev.startsAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{ev.title}</Text>
              <Text style={styles.eventSub}>{ev.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* HIGH-MATCH CAMPUS DRIVES PREVIEW */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Recommended Drives</Text>
            <Text style={styles.cardSubtitle}>
              Pre-screened for your {student.cgpa} CGPA and 0 backlogs
            </Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateTab('jobs')}>
            <Text style={styles.seeAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        {priorityJobs.slice(0, 2).map((job) => (
          <View key={job.id} style={styles.drivePreviewCard}>
            <View style={styles.driveTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.driveCompany}>{job.companyName}</Text>
                <Text style={styles.driveTitle}>{job.title}</Text>
              </View>
              <View style={styles.driveMatchBadge}>
                <Text style={styles.driveMatchText}>{job.matchScore}%</Text>
                <Text style={styles.driveMatchSub}>match</Text>
              </View>
            </View>

            <View style={styles.driveMetaRow}>
              <Text style={styles.driveCtc}>{job.ctcLabel}</Text>
              <Text style={styles.driveLocation}>📍 {job.location}</Text>
              <Text style={styles.driveTier}>{job.tierLabel}</Text>
            </View>

            <TouchableOpacity
              style={styles.driveApplyBtn}
              onPress={() => onOpenApplyModal(job)}
              activeOpacity={0.7}
            >
              <Text style={styles.driveApplyBtnText}>Inspect & 1-Click Apply →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  welcomeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  campusTag: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 4,
  },
  cgpaBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cgpaNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4338CA',
  },
  cgpaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 10,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  slaContainer: {
    backgroundColor: '#1E1B4B',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#312E81',
  },
  slaHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  slaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  slaSubtitle: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 2,
  },
  strikeBadge: {
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  strikeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCD34D',
  },
  slaItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  slaItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  slaItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  slaDuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slaDueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCD34D',
  },
  slaItemSub: {
    fontSize: 12,
    color: '#E0E7FF',
    marginBottom: 12,
  },
  slaBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slaPrepBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  slaPrepBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  slaCompleteBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  slaCompleteBtnText: {
    color: '#1E1B4B',
    fontSize: 12,
    fontWeight: '800',
  },
  emptySlaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 10,
  },
  emptySlaText: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  percentileBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  percentileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  readinessCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EEF2FF',
    borderWidth: 3,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readinessNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4338CA',
  },
  readinessLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6366F1',
  },
  roleTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeRoleTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeRoleTabText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  skillsList: {
    gap: 12,
    marginBottom: 14,
  },
  skillBarItem: {},
  skillBarMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  skillBarScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  barTrack: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  roiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    gap: 10,
  },
  roiTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  roiSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  roiBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roiBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedConflictBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedConflictText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  timetableNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  timetableNoticeText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
    lineHeight: 16,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  eventDateBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 54,
  },
  eventDateText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  eventSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  drivePreviewCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  driveTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  driveCompany: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  driveTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  driveMatchBadge: {
    alignItems: 'flex-end',
  },
  driveMatchText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981',
  },
  driveMatchSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  driveMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  driveCtc: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  driveLocation: {
    fontSize: 12,
    color: '#64748B',
  },
  driveTier: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  driveApplyBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  driveApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
