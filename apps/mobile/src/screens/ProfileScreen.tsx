// apps/mobile/src/screens/ProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from 'react-native';
import { StudentProfile, VerifiedSkill } from '../types/student.types';
import {
  ShieldCheckIcon,
  AwardIcon,
  SparklesIcon,
  BuildingIcon,
  ChevronRightIcon,
} from '../components/Icons';

interface ProfileScreenProps {
  student: StudentProfile;
  skills: VerifiedSkill[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenCollegeModal: () => void;
  onPrepWithTacie: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  student,
  skills,
  isRefreshing,
  onRefresh,
  onOpenCollegeModal,
  onPrepWithTacie,
}) => {
  const [recruiterDiscovery, setRecruiterDiscovery] = useState(
    student.privacyPreferences?.recruiterDiscovery ?? true
  );
  const [alumniConnection, setAlumniConnection] = useState(
    student.privacyPreferences?.alumniConnection ?? true
  );

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const verifierName = student.verifiedBy || (student.verifiedByTpo ? 'Dr. R. K. Deshmukh' : 'TPO Placement Cell');
  const activeResume = student.resumeName || 'Aarav_Sharma_Backend_2026_v3.pdf';
  const atsScore = student.resumeAtsScore || 88;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
    >
      {/* Student Identity Card */}
      <View style={styles.idCard}>
        <View style={styles.idCardTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.degreeText}>{student.degree}</Text>
            <Text style={styles.enrollmentText}>
              Roll No: {student.enrollmentNumber} &bull; Batch {student.batchYear}
            </Text>
          </View>
        </View>

        {/* Tenant College Switcher Pill */}
        <TouchableOpacity
          style={styles.collegeSelector}
          onPress={onOpenCollegeModal}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <BuildingIcon size={14} color="#4F46E5" />
            <View style={{ flex: 1 }}>
              <Text style={styles.collegeNameText} numberOfLines={1}>
                {student.collegeName}
              </Text>
              <Text style={styles.tenantCodeSub}>
                Tenant Code: <Text style={{ fontWeight: '800' }}>{student.collegeCode}</Text> &bull; Tap to switch
              </Text>
            </View>
          </View>
          <ChevronRightIcon size={14} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* VERIFIED ACADEMIC RECORD (TPO Locked Dossier) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.cardTitle}>Verified Academic Dossier</Text>
              <View style={styles.tpoVerifiedBadge}>
                <ShieldCheckIcon size={12} color="#047857" />
                <Text style={styles.tpoVerifiedText}>TPO Locked</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Immutable record verified against University Registrar
            </Text>
          </View>
        </View>

        {/* 4-Stat Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{student.cgpa}</Text>
            <Text style={styles.statLabel}>Cumulative CGPA</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#059669' }]}>
              {student.activeBacklogs}
            </Text>
            <Text style={styles.statLabel}>Active Backlogs</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{student.tenthPercentage}%</Text>
            <Text style={styles.statLabel}>10th Secondary</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{student.twelfthPercentage}%</Text>
            <Text style={styles.statLabel}>12th Higher Sec</Text>
          </View>
        </View>

        {/* SGPA Semester Trend */}
        <View style={styles.sgpaSection}>
          <Text style={styles.sgpaHeader}>SEMESTER SGPA PROGRESSION</Text>
          <View style={styles.sgpaPillsRow}>
            {student.sgpaHistory.map((sgpa, idx) => (
              <View key={idx} style={styles.sgpaPill}>
                <Text style={styles.sgpaSemText}>Sem {idx + 1}</Text>
                <Text style={styles.sgpaValText}>{sgpa.toFixed(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.verifierNotice}>
          <Text style={styles.verifierText}>
            🔒 Signed & Authorized by: <Text style={{ fontWeight: '700' }}>{verifierName}</Text> (Head of Training & Placement)
          </Text>
        </View>
      </View>

      {/* VERIFIED SKILLS & EVIDENCE */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Proctored Technical Skills</Text>
            <Text style={styles.cardSubtitle}>
              Validated via institutional lab exams and coding assessments
            </Text>
          </View>
        </View>

        <View style={styles.skillsList}>
          {skills.map((skill) => (
            <View key={skill.id} style={styles.skillItem}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.skillLevelPill}>
                    <Text style={styles.skillLevelText}>{skill.level}</Text>
                  </View>
                </View>
                <Text style={styles.skillEvidence}>
                  Evidence: {skill.evidenceCount ?? 4} verified submissions
                </Text>
              </View>

              <View style={styles.skillScoreBox}>
                <Text style={styles.skillScoreNum}>{skill.score}%</Text>
                <Text style={styles.skillScoreLabel}>Score</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* RESUME & ATS HEALTH CARD */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Active Placement Resume</Text>
            <Text style={styles.cardSubtitle}>
              Default bound document for all 1-click campus drive applications
            </Text>
          </View>
          <View style={styles.atsScoreCircle}>
            <Text style={styles.atsScoreNum}>{atsScore}</Text>
            <Text style={styles.atsScoreLabel}>ATS</Text>
          </View>
        </View>

        <View style={styles.resumeDocBox}>
          <Text style={{ fontSize: 20 }}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.resumeFileName}>{activeResume}</Text>
            <Text style={styles.resumeMeta}>
              Uploaded Oct 2026 &bull; PDF format &bull; 1.2 MB
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.taciePrepBtn}
          onPress={onPrepWithTacie}
          activeOpacity={0.7}
        >
          <SparklesIcon size={14} color="#FFFFFF" />
          <Text style={styles.taciePrepBtnText}>Re-analyze with TACIE AI</Text>
        </TouchableOpacity>
      </View>

      {/* PRIVACY & PREFERENCES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy & Discovery Settings</Text>
        <Text style={[styles.cardSubtitle, { marginBottom: 12 }]}>
          Control recruiter visibility across multi-tenant institutions
        </Text>

        <View style={styles.prefRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.prefTitle}>Recruiter Discovery</Text>
            <Text style={styles.prefSub}>
              Allow verified partner enterprise recruiters to browse your profile and skills
            </Text>
          </View>
          <Switch
            value={recruiterDiscovery}
            onValueChange={setRecruiterDiscovery}
            trackColor={{ false: '#E2E8F0', true: '#818CF8' }}
            thumbColor={recruiterDiscovery ? '#4F46E5' : '#94A3B8'}
          />
        </View>

        <View style={[styles.prefRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.prefTitle}>Alumni Mentorship Network</Text>
            <Text style={styles.prefSub}>
              Receive 1-on-1 interview mock invites from senior alumni working in tech
            </Text>
          </View>
          <Switch
            value={alumniConnection}
            onValueChange={setAlumniConnection}
            trackColor={{ false: '#E2E8F0', true: '#818CF8' }}
            thumbColor={alumniConnection ? '#4F46E5' : '#94A3B8'}
          />
        </View>
      </View>

      {/* College Placement Cell Support Notice */}
      <View style={styles.supportBox}>
        <Text style={styles.supportTitle}>Need Help or Academic Corrections?</Text>
        <Text style={styles.supportText}>
          Contact Training & Placement Cell at <Text style={{ fontWeight: '700' }}>placements@{student.collegeCode.toLowerCase()}.edu.in</Text>
        </Text>
        <Text style={styles.platformVersionText}>
          CareerOS Mobile &bull; Enterprise Tenant DB Isolation
        </Text>
      </View>

      <View style={{ height: 24 }} />
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
    paddingBottom: 32,
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  idCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  degreeText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  enrollmentText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  collegeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
  },
  collegeNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  tenantCodeSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tpoVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tpoVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  sgpaSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sgpaHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sgpaPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sgpaPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sgpaSemText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  sgpaValText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 2,
  },
  verifierNotice: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 8,
  },
  verifierText: {
    fontSize: 11,
    color: '#166534',
  },
  skillsList: {
    gap: 10,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  skillName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  skillLevelPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  skillLevelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  skillEvidence: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  skillScoreBox: {
    alignItems: 'flex-end',
  },
  skillScoreNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  skillScoreLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  atsScoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atsScoreNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4338CA',
  },
  atsScoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6366F1',
  },
  resumeDocBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  resumeFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  resumeMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  taciePrepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
  },
  taciePrepBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  prefSub: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  supportBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  supportTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  supportText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  platformVersionText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
  },
});
