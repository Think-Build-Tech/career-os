// apps/mobile/src/screens/JobsScreen.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { JobOpportunity } from '../types/student.types';
import {
  SearchIcon,
  CloseIcon,
  MapPinIcon,
  BuildingIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon,
} from '../components/Icons';

interface JobsScreenProps {
  jobs: JobOpportunity[];
  appliedJobIds: string[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenApplyModal: (job: JobOpportunity) => void;
  onPrepWithTacie: (job: JobOpportunity) => void;
}

type TierFilter = 'ALL' | 'SUPER_DREAM' | 'DREAM' | 'CORE' | 'INTERNSHIP';

export const JobsScreen: React.FC<JobsScreenProps> = ({
  jobs,
  appliedJobIds,
  isRefreshing,
  onRefresh,
  onOpenApplyModal,
  onPrepWithTacie,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState<TierFilter>('ALL');

  const filterOptions: { id: TierFilter; label: string }[] = [
    { id: 'ALL', label: 'All Drives' },
    { id: 'SUPER_DREAM', label: '⭐ Super Dream (₹18L+)' },
    { id: 'DREAM', label: '🚀 Dream (₹10L+)' },
    { id: 'CORE', label: '🏢 Core / Mass' },
    { id: 'INTERNSHIP', label: '⏱️ Internships' },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tier filter
      if (activeTier === 'SUPER_DREAM' && !job.tier.includes('SUPER_DREAM')) return false;
      if (activeTier === 'DREAM' && (!job.tier.includes('DREAM') || job.tier.includes('SUPER_DREAM'))) return false;
      if (activeTier === 'CORE' && !job.tier.includes('CORE') && !job.tier.includes('MASS')) return false;
      if (activeTier === 'INTERNSHIP' && job.jobType !== 'INTERNSHIP') return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchCompany = job.companyName.toLowerCase().includes(q);
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchLocation = job.location.toLowerCase().includes(q);
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));

      return matchCompany || matchTitle || matchLocation || matchSkills;
    });
  }, [jobs, activeTier, searchQuery]);

  const getTierColor = (tier: string) => {
    if (tier.includes('SUPER_DREAM')) {
      return { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' };
    }
    if (tier.includes('DREAM')) {
      return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
    }
    return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
  };

  return (
    <View style={styles.container}>
      {/* Search Header Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search company, role, or skill..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <CloseIcon size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tier Filter Horizontal Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((filter) => {
            const isActive = activeTier === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isActive && styles.activeFilterChip]}
                onPress={() => setActiveTier(filter.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Drive List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
      >
        <View style={styles.resultsMetaRow}>
          <Text style={styles.resultsCountText}>
            Showing <Text style={{ fontWeight: '800', color: '#0F172A' }}>{filteredJobs.length}</Text> active campus drives
          </Text>
          <Text style={styles.resultsPreVerifiedText}>✓ Pre-verified by College TPO</Text>
        </View>

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const tierStyle = getTierColor(job.tier);
            const isHighMatch = (job.matchScore || 0) >= 85;
            const isEligible = job.isEligible ?? (job.eligibilityStatus === 'ELIGIBLE');
            const minCgpa = job.eligibilityCriteria?.minCgpa ?? 7.5;
            const maxBacklogs = job.eligibilityCriteria?.maxBacklogs ?? 0;

            return (
              <View key={job.id} style={styles.jobCard}>
                {/* Header Row: Company, Tier, CTC */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={styles.companyRow}>
                      <BuildingIcon size={14} color="#4F46E5" />
                      <Text style={styles.companyName}>{job.companyName}</Text>
                    </View>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                  </View>

                  <View style={styles.ctcBlock}>
                    <Text style={styles.ctcValue}>{job.ctcLabel}</Text>
                    <Text style={styles.ctcType}>{job.jobType.replace('_', ' ')}</Text>
                  </View>
                </View>

                {/* Badges Row */}
                <View style={styles.badgeRow}>
                  <View style={[styles.tierBadge, { backgroundColor: tierStyle.bg, borderColor: tierStyle.border }]}>
                    <Text style={[styles.tierText, { color: tierStyle.text }]}>{job.tierLabel}</Text>
                  </View>

                  <View style={styles.metaBadge}>
                    <MapPinIcon size={12} color="#64748B" />
                    <Text style={styles.metaBadgeText}>{job.location}</Text>
                  </View>

                  {job.matchScore ? (
                    <View style={[styles.matchBadge, isHighMatch ? styles.matchHigh : styles.matchMed]}>
                      <SparklesIcon size={12} color={isHighMatch ? '#047857' : '#B45309'} />
                      <Text style={[styles.matchText, isHighMatch ? styles.matchTextHigh : styles.matchTextMed]}>
                        {job.matchScore}% Match
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Eligibility Note */}
                <View style={styles.eligibilityRow}>
                  <View style={[styles.eligibilityDot, !isEligible && { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.eligibilityText}>
                    {isEligible ? (
                      <Text style={{ color: '#047857', fontWeight: '700' }}>
                        Eligible &bull;{' '}
                        <Text style={{ fontWeight: '500', color: '#334155' }}>
                          Min CGPA {minCgpa} &bull; Max Backlogs {maxBacklogs}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={{ color: '#DC2626', fontWeight: '700' }}>
                        Ineligible &bull; Criteria does not meet current profile
                      </Text>
                    )}
                  </Text>
                </View>

                {/* Required Skills Chips */}
                <View style={styles.skillsRow}>
                  {job.skills.map((skill) => (
                    <View key={skill} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{skill}</Text>
                    </View>
                  ))}
                </View>

                {/* Hiring Rounds Bar */}
                {job.rounds && job.rounds.length > 0 && (
                  <View style={styles.roundsContainer}>
                    <Text style={styles.roundsHeader}>
                      HIRING PROCESS ({job.rounds.length} ROUNDS)
                    </Text>
                    <View style={styles.roundsList}>
                      {job.rounds.map((round, idx) => (
                        <View key={round.id || idx} style={styles.roundItem}>
                          <Text style={styles.roundNum}>{idx + 1}</Text>
                          <Text style={styles.roundName} numberOfLines={1}>
                            {round.title || round.name}
                          </Text>
                          {idx < job.rounds.length - 1 && (
                            <Text style={styles.roundDivider}>→</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Deadline & Actions Row */}
                <View style={styles.actionRow}>
                  <View style={styles.deadlineContainer}>
                    <ClockIcon size={12} color="#64748B" />
                    <Text style={styles.deadlineText}>Deadline: Nov 15, 2026</Text>
                  </View>

                  <View style={styles.btnGroup}>
                    <TouchableOpacity
                      style={styles.prepBtn}
                      onPress={() => onPrepWithTacie(job)}
                      activeOpacity={0.7}
                    >
                      <SparklesIcon size={14} color="#4F46E5" />
                      <Text style={styles.prepBtnText}>Prep</Text>
                    </TouchableOpacity>

                    {isApplied ? (
                      <View style={styles.appliedBadge}>
                        <CheckIcon size={14} color="#047857" />
                        <Text style={styles.appliedBadgeText}>Applied</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => onOpenApplyModal(job)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.applyBtnText}>1-Click Apply →</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching placement drives found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search query or switching tier filters above.
            </Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={() => {
                setSearchQuery('');
                setActiveTier('ALL');
              }}
            >
              <Text style={styles.resetFilterBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
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
  searchHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: '#1E1B4B',
    borderColor: '#1E1B4B',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  resultsMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCountText: {
    fontSize: 12,
    color: '#64748B',
  },
  resultsPreVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  ctcBlock: {
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ctcValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  ctcType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'capitalize',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '800',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  matchHigh: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  matchMed: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  matchText: {
    fontSize: 11,
    fontWeight: '800',
  },
  matchTextHigh: {
    color: '#047857',
  },
  matchTextMed: {
    color: '#B45309',
  },
  eligibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  eligibilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  eligibilityText: {
    fontSize: 11,
    flex: 1,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  roundsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  roundsHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  roundsList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  roundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roundNum: {
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: '#E2E8F0',
    color: '#475569',
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  roundName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    maxWidth: 90,
  },
  roundDivider: {
    fontSize: 11,
    color: '#CBD5E1',
    marginHorizontal: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  prepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  prepBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  applyBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  appliedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
