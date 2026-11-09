import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  UserDto,
  StudentProfileDto,
  StudentCareerProfileDto,
  StudentPreferencesDto,
  CreateStudentRequestDto,
  StudentActionItemDto,
  AcademicRecordDto,
  AcademicEventDto,
  ConflictCheckRequest,
  ConflictCheckResponse,
  InstitutionDto,
  JobOpportunityDto,
  SubmitApplicationRequest,
  StudentApplicationDto,
  PlacementOfferDto,
  AcceptOfferRequest,
  PlacementComplianceDto,
  SkillGapAnalysisDto,
  TacieResumeAnalysisDto,
  TacieQuotaDto,
  AssessmentDto,
  AssessmentBadgeDto,
  ProctorPreflightRequest,
  AlumniProfileDto,
  ReferralPostDto,
  RequestReferralDto,
  BookMentorshipRequest,
  ConversationDto,
  ChatMessageDto,
  StudentSkillItemDto,
  ResumeDocumentDto,
  ResumeVersionDto,
  StudentProjectDto,
  NotificationDto,
  LearningPostDto,
  SavedItemDto,
  ReputationSummaryDto,
  RewardTransactionDto,
  DataAccessAuditLogDto
} from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class ApiService{
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;

    private extractList<T>(data: any): T[]{
        if(Array.isArray(data)) return data;
        if(data && Array.isArray(data.items)) return data.items;
        if(data && Array.isArray(data.rows)) return data.rows;
        return [];
    }

    getUserById(userId: string): Observable<UserDto>{
        return this.http.get<any>(`${this.baseUrl}/users/${userId}`).pipe(
          map(row => {
            const u = row.user ?? row.data;
            if (u && !u.name && (u.first_name || u.last_name)) {
              u.name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
            }
            return u;
          })
        );
    }

    getStudentById(studentId: string): Observable<StudentProfileDto>{
        return this.http.get<any>(`${this.baseUrl}/students/${studentId}`).pipe(map(row => row.data ?? row.student));
    }

    getStudentCareerProfile(studentId: string): Observable<StudentCareerProfileDto>{
        return this.http.get<any>(`${this.baseUrl}/students/${studentId}/career-profile`).pipe(map(row => row.data ?? row.careerProfile));
    }

    updateStudentPreferences(studentId: string, prefs: Partial<StudentPreferencesDto>): Observable<StudentPreferencesDto>{
        return this.http.put<any>(`${this.baseUrl}/students/${studentId}/preferences`, prefs).pipe(map(row => row.data ?? row.preferences));
    }

    submitStudentRequest(payload: CreateStudentRequestDto): Observable<any>{
        return this.http.post<any>(`${this.baseUrl}/students/requests`, payload).pipe(map(row => row.data ?? row.request));
    }

    getStudentActionItems(studentId: string): Observable<StudentActionItemDto[]>{
        const params = new HttpParams().set('student_id', studentId);
        return this.http.get<any>(`${this.baseUrl}/students/action-items`, { params }).pipe(map(row => this.extractList<StudentActionItemDto>(row.actionItems ?? row.data ?? row.rows)))
    }

    completeActionItem(actionItemId: string): Observable<StudentActionItemDto> {
        return this.http.patch<any>(`${this.baseUrl}/students/action-items/${actionItemId}/complete`, {}).pipe(map(r => r.data ?? r.actionItem));
    }



    getAcademicRecords(page = 1, limit = 20): Observable<AcademicRecordDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/academic/records`, { params }).pipe(map(r => this.extractList<AcademicRecordDto>(r.data)));
    }

    getAcademicEvents(): Observable<AcademicEventDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/academic/events`).pipe(map(r => this.extractList<AcademicEventDto>(r.data)));
    }

    detectTimetableConflicts(payload: ConflictCheckRequest): Observable<ConflictCheckResponse> {
        return this.http.post<ApiResponse<ConflictCheckResponse>>(`${this.baseUrl}/academic/events/conflicts`, payload).pipe(map(r => r.data));
    }

    getInstitutions(page = 1, limit = 20): Observable<InstitutionDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/institutions`, { params }).pipe(map(r => this.extractList<InstitutionDto>(r.data)));
    }




    getJobOpportunities(page = 1, limit = 50): Observable<JobOpportunityDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/placements/opportunities`, { params }).pipe(map(r => this.extractList<JobOpportunityDto>(r.data)));
    }

    getPlacementDrives(): Observable<StudentApplicationDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/placements/drives`).pipe(map(r => this.extractList<StudentApplicationDto>(r.data)));
    }

    applyForJob(payload: SubmitApplicationRequest): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/placements/apply`, payload).pipe(map(r => r.data));
    }

    acceptJobOffer(offerId: string, payload: AcceptOfferRequest): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/placements/offers/${offerId}/accept`, payload).pipe(map(r => r.data));
    }

    getStudentCompliance(studentId: string): Observable<PlacementComplianceDto> {
        return this.http.get<ApiResponse<PlacementComplianceDto>>(`${this.baseUrl}/placements/compliance/${studentId}`).pipe(map(r => r.data));
    }




    analyzeSkillGap(student_id: string, target_role: string): Observable<SkillGapAnalysisDto> {
        return this.http.post<any>(`${this.baseUrl}/tacie/skill-gap`, { student_id, target_role }).pipe(map(r => r.data ?? r.skillGap));
    }

    runTacieResumeAnalysis(payload: { resume_id: string; ai_run_id?: string; overall_score?: number; metrics?: any }): Observable<TacieResumeAnalysisDto> {
        return this.http.post<any>(`${this.baseUrl}/tacie/resume-analysis`, payload).pipe(map(r => r.data ?? r.analysis));
    }

    enhanceResume(payload: {
        student_id: string;
        resume_id?: string;
        resume_version_id?: string;
        resume_text?: string;
        target_role?: string;
        job_description?: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/tacie/resume-enhance`, payload).pipe(map(r => r.data ?? r.analysis));
    }

    askTacieAdvisor(payload: { student_id: string; user_id?: string; message: string; history?: Array<{ role: string; content: string }> }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/tacie/advisor`, payload).pipe(map(r => r.data ?? { content: r.reply }));
    }

    getUserAiQuota(userId: string, defaultLimit = 50): Observable<TacieQuotaDto> {
        const params = new HttpParams().set('defaultLimit', defaultLimit);
        return this.http.get<any>(`${this.baseUrl}/tacie/quota/${userId}`, { params }).pipe(map(r => r.data ?? r.quota));
    }







    getAssessments(page = 1, limit = 20): Observable<AssessmentDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/assessments`, { params }).pipe(map(r => this.extractList<AssessmentDto>(r.data)));
    }

    bookAssessmentSlot(slot_id: string, student_id: string): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/assessments/slots/book`, { slot_id, student_id }).pipe(map(r => r.data));
    }

    submitProctorPreflight(payload: ProctorPreflightRequest): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/assessments/preflight`, payload).pipe(map(r => r.data));
    }

    getEarnedAssessmentBadges(): Observable<AssessmentBadgeDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/assessments/badges`).pipe(map(r => this.extractList<AssessmentBadgeDto>(r.data)));
    }







    getAlumniProfiles(page = 1, limit = 20): Observable<AlumniProfileDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/alumni/profiles`, { params }).pipe(map(r => this.extractList<AlumniProfileDto>(r.data)));
    }

    getAlumniReferrals(): Observable<ReferralPostDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/alumni/referrals`).pipe(map(r => this.extractList<ReferralPostDto>(r.data)));
    }

    requestAlumniReferral(payload: RequestReferralDto): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/alumni/referrals/request`, payload).pipe(map(r => r.data));
    }

    bookMentorshipSlot(payload: BookMentorshipRequest): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/alumni/mentorship/book`, payload).pipe(map(r => r.data));
    }







    getConversations(): Observable<ConversationDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/chat/conversations`).pipe(map(r => this.extractList<ConversationDto>(r.data)));
    }

    createConversation(payload: { conversation_type: ConversationDto['conversation_type']; title: string; participant_ids: string[] }): Observable<ConversationDto> {
        return this.http.post<ApiResponse<ConversationDto>>(`${this.baseUrl}/chat/conversations`, payload).pipe(map(r => r.data));
    }

    getMessagesInConversation(conversationId: string): Observable<ChatMessageDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/chat/conversations/${conversationId}/messages`).pipe(map(r => this.extractList<ChatMessageDto>(r.data)));
    }

    sendMessage(payload: { conversation_id: string; sender_id: string; content: string }): Observable<ChatMessageDto> {
        return this.http.post<ApiResponse<ChatMessageDto>>(`${this.baseUrl}/chat/messages`, payload).pipe(map(r => r.data));
    }


    getStudentSkillProfile(studentId: string): Observable<StudentSkillItemDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/skills/student/${studentId}`).pipe(map(r => this.extractList<StudentSkillItemDto>(r.data)));
    }


    getStudentResumes(studentId?: string): Observable<ResumeDocumentDto[]> {
        const params = studentId ? new HttpParams().set('student_id', studentId) : undefined;
        return this.http.get<any>(`${this.baseUrl}/resumes`, { params }).pipe(
          map(r => this.extractList<ResumeDocumentDto>(r.resumes ?? r.data))
        );
    }

    getResumeVersions(resumeId: string): Observable<ResumeVersionDto[]> {
        return this.http.get<any>(`${this.baseUrl}/resumes/${resumeId}/versions`).pipe(
          map(r => this.extractList<ResumeVersionDto>(r.versions ?? r.data))
        );
    }




    getStudentProjects(page = 1, limit = 20): Observable<StudentProjectDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/projects`, { params }).pipe(map(r => this.extractList<StudentProjectDto>(r.data)));
    }

    createStudentProject(payload: Omit<StudentProjectDto, 'id'>): Observable<StudentProjectDto> {
        return this.http.post<ApiResponse<StudentProjectDto>>(`${this.baseUrl}/projects`, payload).pipe(map(r => r.data));
    }





    getNotifications(): Observable<NotificationDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/notifications`).pipe(map(r => this.extractList<NotificationDto>(r.data)));
    }

    markNotificationAsRead(notificationId: string): Observable<NotificationDto> {
        return this.http.patch<ApiResponse<NotificationDto>>(`${this.baseUrl}/notifications/${notificationId}/read`, {}).pipe(map(r => r.data));
    }

    // 22. Learning Marketplace & Bookmarks
    getLearningPosts(page = 1, limit = 20): Observable<LearningPostDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/learning/posts`, { params }).pipe(map(r => this.extractList<LearningPostDto>(r.data)));
    }

    createLearningPost(payload: { author_id: string; title: string; content: string; category: string }): Observable<LearningPostDto> {
        return this.http.post<ApiResponse<LearningPostDto>>(`${this.baseUrl}/learning/posts`, payload).pipe(map(r => r.data));
    }

    toggleSavedItem(payload: { user_id: string; item_type: SavedItemDto['item_type']; item_id: string }): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/learning/saves/toggle`, payload).pipe(map(r => r.data));
    }

    getSavedItems(userId: string): Observable<SavedItemDto[]> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/learning/saves/${userId}`).pipe(map(r => this.extractList<SavedItemDto>(r.data)));
    }

    // 24. Reputation & 25. Rewards
    getStudentReputationSummary(studentId: string): Observable<ReputationSummaryDto> {
        return this.http.get<ApiResponse<ReputationSummaryDto>>(`${this.baseUrl}/reputation/summaries/student/${studentId}`).pipe(map(r => r.data));
    }

    getRewardTransactions(page = 1, limit = 20): Observable<RewardTransactionDto[]> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/rewards`, { params }).pipe(map(r => this.extractList<RewardTransactionDto>(r.data)));
    }

    // 28. Audit & Access Logs
    getStudentAuditLogs(student_id: string): Observable<DataAccessAuditLogDto[]> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/audit/student-logs`, { student_id }).pipe(map(r => this.extractList<DataAccessAuditLogDto>(r.data)));
    }

    logProtectedResourceAccess(payload: {
        resource_owner_id: string;
        actor_user_id: string;
        resource_type: string;
        resource_id: string;
        access_type: 'VIEW' | 'DOWNLOAD';
        purpose: string;
    }): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/audit/log-access`, payload).pipe(map(r => r.data));
    }
}
