// apps/mobile/src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  StudentNavTab,
  StudentProfile,
  StudentActionItem,
  PlacementCompliance,
  SkillGapAnalysis,
  AcademicEvent,
  JobOpportunity,
  StudentApplication,
  PlacementOffer,
  ChatMessage,
  TacieQuota,
  VerifiedSkill,
} from './types/student.types';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_SLA_ITEMS,
  MOCK_COMPLIANCE,
  MOCK_SKILL_GAP,
  MOCK_ACADEMIC_EVENTS,
  MOCK_JOB_OPPORTUNITIES,
  MOCK_APPLICATIONS,
  MOCK_OFFERS,
  MOCK_CHAT_MESSAGES,
  MOCK_QUOTA,
  MOCK_VERIFIED_SKILLS,
} from './services/mockData';
import { mobileApi } from './services/api.service';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CollegeModal } from './components/CollegeModal';
import { ApplyModal } from './components/ApplyModal';
import { OfferModal } from './components/OfferModal';
import { HomeScreen } from './screens/HomeScreen';
import { JobsScreen } from './screens/JobsScreen';
import { ApplicationsScreen } from './screens/ApplicationsScreen';
import { TacieChatScreen } from './screens/TacieChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

export const App = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<StudentNavTab>('home');

  // Core Data States
  const [student, setStudent] = useState<StudentProfile>(MOCK_STUDENT_PROFILE);
  const [actions, setActions] = useState<StudentActionItem[]>(MOCK_SLA_ITEMS);
  const [compliance, setCompliance] = useState<PlacementCompliance>(MOCK_COMPLIANCE);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis>(MOCK_SKILL_GAP);
  const [events, setEvents] = useState<AcademicEvent[]>(MOCK_ACADEMIC_EVENTS);
  const [jobs, setJobs] = useState<JobOpportunity[]>(MOCK_JOB_OPPORTUNITIES);
  const [applications, setApplications] = useState<StudentApplication[]>(MOCK_APPLICATIONS);
  const [offers, setOffers] = useState<PlacementOffer[]>(MOCK_OFFERS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [quota, setQuota] = useState<TacieQuota>(MOCK_QUOTA);
  const [skills, setSkills] = useState<VerifiedSkill[]>(MOCK_VERIFIED_SKILLS);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([
    'fa500000-0000-0000-0000-000000000001',
    'fa500000-0000-0000-0000-000000000002',
  ]);

  // Network & UI States
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Modals
  const [collegeModalVisible, setCollegeModalVisible] = useState(false);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOpportunity | null>(null);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOfferForAccept, setSelectedOfferForAccept] = useState<PlacementOffer | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Sync data with backend (or graceful fallback)
  const syncData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const online = await mobileApi.checkHealth();
      setIsOnline(online);

      if (online) {
        const [
          profileData,
          actionsData,
          complianceData,
          eventsData,
          jobsData,
          applicationsData,
          offersData,
          quotaData,
          skillsData,
        ] = await Promise.all([
          mobileApi.getStudentProfile(),
          mobileApi.getActionItems(),
          mobileApi.getCompliance(),
          mobileApi.getAcademicEvents(),
          mobileApi.getJobOpportunities(),
          mobileApi.getApplications(),
          mobileApi.getOffers(),
          mobileApi.getTacieQuota(),
          mobileApi.getVerifiedSkills(),
        ]);

        if (profileData) setStudent(profileData);
        if (actionsData) setActions(actionsData);
        if (complianceData) setCompliance(complianceData);
        if (eventsData) setEvents(eventsData);
        if (jobsData) setJobs(jobsData);
        if (applicationsData) setApplications(applicationsData);
        if (offersData) setOffers(offersData);
        if (quotaData) setQuota(quotaData);
        if (skillsData) setSkills(skillsData);

        showToast('✓ Synced with College Placement ERP', 'info');
      }
    } catch {
      setIsOnline(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    syncData();
  }, [syncData]);

  // College Switcher Handler
  const handleSelectCollege = async (code: string) => {
    const res = await mobileApi.resolveCollege(code);
    if (res.success && res.tenant) {
      setStudent((prev) => ({
        ...prev,
        collegeCode: res.tenant.college_code,
        collegeName: res.tenant.name,
      }));
      showToast(`🏫 Connected to ${res.tenant.name} (${res.tenant.college_code})`, 'success');
      syncData();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSaveApiUrl = (url: string) => {
    mobileApi.setBaseUrl(url);
    showToast(`API URL updated: ${url}`, 'info');
    syncData();
  };

  // Complete an SLA Item
  const handleCompleteSla = async (actionId: string) => {
    await mobileApi.completeActionItem(actionId);
    setActions((prev) =>
      prev.map((item) =>
        item.id === actionId ? { ...item, completedAt: new Date().toISOString() } : item
      )
    );
    showToast('✓ Priority SLA confirmed and completed', 'success');
  };

  // 1-Click Apply Flow
  const handleOpenApplyModal = (job: JobOpportunity) => {
    setSelectedJobForApply(job);
    setApplyModalVisible(true);
  };

  const handleConfirmApply = async (jobId: string) => {
    await mobileApi.applyForJob(jobId);
    setAppliedJobIds((prev) => [...prev, jobId]);

    if (selectedJobForApply) {
      const newApp: StudentApplication = {
        id: `app-${Date.now()}`,
        opportunityId: selectedJobForApply.id,
        companyName: selectedJobForApply.companyName,
        roleTitle: selectedJobForApply.title,
        tierLabel: selectedJobForApply.tierLabel,
        ctcLabel: selectedJobForApply.ctcLabel,
        appliedDate: 'Just now',
        currentStep: 1,
        totalSteps: selectedJobForApply.rounds?.length || 3,
        currentStageLabel: 'Applied · In Review',
        stageTone: 'good',
        lockedResumeTitle: 'Aarav_Sharma_Backend_2026_v3.pdf',
        rounds: [
          {
            title: selectedJobForApply.rounds?.[0]?.title || 'Pre-Screening',
            dateLabel: 'Today',
            status: 'COMPLETED',
            description: 'Application and verified academic record submitted',
          },
          {
            title: selectedJobForApply.rounds?.[1]?.title || 'Technical Assessment',
            dateLabel: 'Upcoming',
            status: 'UPCOMING',
            description: 'Awaiting scheduling from placement cell',
          },
        ],
      };
      setApplications((prev) => [newApp, ...prev]);
    }
    showToast(`🚀 Application submitted to ${selectedJobForApply?.companyName}!`, 'success');
  };

  // Accept Offer Flow
  const handleOpenOfferModal = (offer: PlacementOffer) => {
    setSelectedOfferForAccept(offer);
    setOfferModalVisible(true);
  };

  const handleConfirmAcceptOffer = async (offerId: string) => {
    await mobileApi.acceptOffer(offerId, student.id);
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'ACCEPTED' } : o))
    );
    setStudent((prev) => ({
      ...prev,
      placementStatus: 'PLACED',
    }));
    showToast('🎉 Placement Offer Formally Accepted! Signed agreement recorded.', 'success');
  };

  // TACIE Chat Handler
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const reply = await mobileApi.sendTacieMessage(text);
      setChatMessages((prev) => [...prev, reply]);
      setQuota((prev) => ({
        ...prev,
        remainingCredits: Math.max(0, prev.remainingCredits - 1),
        usedCredits: prev.usedCredits + 1,
      }));
    } catch {
      const errorReply: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tacie',
        text: "I couldn't reach the placement engine. Please check your connection or retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrepWithTacieFromJob = (job: JobOpportunity) => {
    setCurrentTab('tacie');
    setTimeout(() => {
      handleSendChatMessage(`How should I prepare for the upcoming ${job.companyName} (${job.title}) drive?`);
    }, 200);
  };

  const handlePrepWithTacieFromApp = (app: StudentApplication) => {
    setCurrentTab('tacie');
    setTimeout(() => {
      handleSendChatMessage(`What should I expect in the next round for ${app.companyName}?`);
    }, 200);
  };

  const handleSwitchBenchmark = async (roleName: string) => {
    const gap = await mobileApi.getSkillGap(roleName);
    setSkillGap(gap);
    showToast(`Role benchmark switched: ${roleName}`, 'info');
  };

  // Badge counts for bottom nav
  const pendingSlaCount = actions.filter((a) => !a.completedAt).length;
  const newDrivesCount = jobs.filter((j) => !appliedJobIds.includes(j.id)).length;
  const pendingOffersCount = offers.filter((o) => o.status === 'PENDING').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Universal Header */}
      <Header
        collegeCode={student.collegeCode}
        collegeName={student.collegeName}
        isOnline={isOnline}
        onOpenCollegeModal={() => setCollegeModalVisible(true)}
        onRefresh={syncData}
        isRefreshing={isRefreshing}
      />

      {/* In-App Toast Banner */}
      {toast && (
        <View
          style={[
            styles.toastBanner,
            toast.type === 'success'
              ? styles.toastSuccess
              : toast.type === 'error'
              ? styles.toastError
              : styles.toastInfo,
          ]}
        >
          <Text
            style={[
              styles.toastText,
              toast.type === 'success'
                ? styles.toastTextSuccess
                : toast.type === 'error'
                ? styles.toastTextError
                : styles.toastTextInfo,
            ]}
          >
            {toast.message}
          </Text>
          <TouchableOpacity onPress={() => setToast(null)}>
            <Text style={styles.toastClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Screen Container */}
      <View style={styles.screenContainer}>
        {currentTab === 'home' && (
          <HomeScreen
            student={student}
            actions={actions}
            compliance={compliance}
            skillGap={skillGap}
            events={events}
            priorityJobs={jobs}
            isRefreshing={isRefreshing}
            onRefresh={syncData}
            onNavigateTab={setCurrentTab}
            onCompleteSla={handleCompleteSla}
            onOpenApplyModal={handleOpenApplyModal}
            onSwitchBenchmark={handleSwitchBenchmark}
          />
        )}

        {currentTab === 'jobs' && (
          <JobsScreen
            jobs={jobs}
            appliedJobIds={appliedJobIds}
            isRefreshing={isRefreshing}
            onRefresh={syncData}
            onOpenApplyModal={handleOpenApplyModal}
            onPrepWithTacie={handlePrepWithTacieFromJob}
          />
        )}

        {currentTab === 'apps' && (
          <ApplicationsScreen
            applications={applications}
            offers={offers}
            compliance={compliance}
            isRefreshing={isRefreshing}
            onRefresh={syncData}
            onOpenOfferModal={handleOpenOfferModal}
            onPrepWithTacie={handlePrepWithTacieFromApp}
          />
        )}

        {currentTab === 'tacie' && (
          <TacieChatScreen
            messages={chatMessages}
            quota={quota}
            isLoading={isAiLoading}
            onSendMessage={handleSendChatMessage}
            onActionClick={(_actionType, title) => {
              if (title.toLowerCase().includes('job') || title.toLowerCase().includes('drive')) {
                setCurrentTab('jobs');
              } else if (title.toLowerCase().includes('offer') || title.toLowerCase().includes('interview')) {
                setCurrentTab('apps');
              } else {
                setCurrentTab('profile');
              }
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            student={student}
            skills={skills}
            isRefreshing={isRefreshing}
            onRefresh={syncData}
            onOpenCollegeModal={() => setCollegeModalVisible(true)}
            onPrepWithTacie={() => {
              setCurrentTab('tacie');
              setTimeout(() => {
                handleSendChatMessage('Can you review my resume ATS score and suggest high-impact improvements?');
              }, 200);
            }}
          />
        )}
      </View>

      {/* Bottom 5-Tab Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingSlaCount={pendingSlaCount}
        openDrivesCount={newDrivesCount}
        pendingOffersCount={pendingOffersCount}
      />

      {/* College Switcher Modal */}
      <CollegeModal
        visible={collegeModalVisible}
        currentCode={student.collegeCode}
        apiUrl={mobileApi.getBaseUrl()}
        onClose={() => setCollegeModalVisible(false)}
        onSelectCollege={handleSelectCollege}
        onSaveApiUrl={handleSaveApiUrl}
      />

      {/* 1-Click Apply Modal */}
      <ApplyModal
        visible={applyModalVisible}
        job={selectedJobForApply}
        student={student}
        onClose={() => {
          setApplyModalVisible(false);
          setSelectedJobForApply(null);
        }}
        onConfirmApply={handleConfirmApply}
      />

      {/* Formal Offer Acceptance Modal */}
      <OfferModal
        visible={offerModalVisible}
        offer={selectedOfferForAccept}
        onClose={() => {
          setOfferModalVisible(false);
          setSelectedOfferForAccept(null);
        }}
        onAcceptOffer={handleConfirmAcceptOffer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  toastBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 999,
  },
  toastSuccess: {
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
  },
  toastError: {
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  toastInfo: {
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: '#C7D2FE',
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  toastTextSuccess: {
    color: '#047857',
  },
  toastTextError: {
    color: '#B91C1C',
  },
  toastTextInfo: {
    color: '#4338CA',
  },
  toastClose: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B7280',
    padding: 2,
  },
});

export default App;
