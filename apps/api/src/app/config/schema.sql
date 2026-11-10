--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academic_events (
    id uuid NOT NULL,
    department_id uuid,
    program_id uuid,
    cohort_id uuid,
    event_type character varying(64) DEFAULT 'EXAM'::character varying NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    location character varying(255),
    is_mandatory boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: ai_credit_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_credit_events (
    id uuid NOT NULL,
    quota_id uuid NOT NULL,
    user_id uuid NOT NULL,
    ai_run_id uuid,
    feature character varying(64) NOT NULL,
    credits_consumed integer NOT NULL,
    input_tokens integer DEFAULT 0 NOT NULL,
    output_tokens integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: ai_message_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_message_metadata (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    ai_run_id uuid,
    model_name character varying(120) NOT NULL,
    model_version character varying(120),
    prompt_tokens integer,
    completion_tokens integer,
    latency_ms integer,
    retrieval_count integer,
    confidence_score numeric(6,5),
    created_at timestamp with time zone NOT NULL
);


--
-- Name: ai_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_runs (
    id uuid NOT NULL,
    run_type character varying(64) NOT NULL,
    model_name character varying(120) NOT NULL,
    model_version character varying(120) NOT NULL,
    input_snapshot_hash character varying(128) NOT NULL,
    status character varying(32) DEFAULT 'QUEUED'::character varying NOT NULL,
    prompt_tokens integer,
    completion_tokens integer,
    estimated_cost numeric(14,6),
    error_details jsonb,
    started_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: ai_usage_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_usage_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id uuid NOT NULL UNIQUE,
    client_id character varying(128) NOT NULL,
    application_id character varying(256),
    signature_type character varying(128) NOT NULL,
    provider character varying(64) NOT NULL,
    model_name character varying(256) NOT NULL,
    status character varying(32) NOT NULL,
    input_tokens integer,
    output_tokens integer,
    total_tokens integer,
    latency_ms integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    error_code character varying(128),
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_usage_quotas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_usage_quotas (
    id uuid NOT NULL,
    scope_type character varying(32) NOT NULL,
    scope_id character varying(128) NOT NULL,
    credit_limit integer NOT NULL,
    used_credits integer DEFAULT 0 NOT NULL,
    reset_frequency character varying(32) DEFAULT 'MONTHLY'::character varying NOT NULL,
    last_reset_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: alumni_connection_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_connection_requests (
    id uuid NOT NULL,
    alumni_id uuid NOT NULL,
    student_id uuid NOT NULL,
    request_type character varying(32) NOT NULL,
    message text,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    responded_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: alumni_employments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_employments (
    id uuid NOT NULL,
    alumni_id uuid NOT NULL,
    company_name character varying(255) NOT NULL,
    role_title character varying(255) NOT NULL,
    location character varying(255),
    start_date date NOT NULL,
    end_date date,
    is_current boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: alumni_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    former_student_id uuid,
    graduation_year smallint,
    headline character varying(200),
    bio text,
    referrals_enabled boolean DEFAULT false NOT NULL,
    mentoring_enabled boolean DEFAULT false NOT NULL,
    student_chat_enabled boolean DEFAULT false NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: application_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_status_history (
    id uuid NOT NULL,
    application_id uuid NOT NULL,
    from_status character varying(32),
    to_status character varying(32) NOT NULL,
    changed_by uuid,
    reason text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: artifact_attestations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.artifact_attestations (
    id uuid NOT NULL,
    artifact_type character varying(64) NOT NULL,
    artifact_id uuid NOT NULL,
    hash_algorithm character varying(32) DEFAULT 'SHA-256'::character varying NOT NULL,
    artifact_hash character varying(128) NOT NULL,
    signature text NOT NULL,
    signer_user_id uuid,
    signer_public_key_fingerprint character varying(128),
    attested_at timestamp with time zone NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: assessment_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_assignments (
    id uuid NOT NULL,
    assessment_id uuid NOT NULL,
    scope_type character varying(32) NOT NULL,
    scope_id uuid NOT NULL,
    available_from timestamp with time zone,
    due_at timestamp with time zone,
    max_attempts smallint DEFAULT 1 NOT NULL,
    created_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: assessment_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_attempts (
    id uuid NOT NULL,
    assessment_id uuid NOT NULL,
    assignment_id uuid,
    student_id uuid NOT NULL,
    attempt_number smallint NOT NULL,
    status character varying(32) DEFAULT 'IN_PROGRESS'::character varying NOT NULL,
    score numeric(8,2),
    started_at timestamp with time zone NOT NULL,
    submitted_at timestamp with time zone,
    graded_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: assessment_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_questions (
    id uuid NOT NULL,
    assessment_id uuid NOT NULL,
    question_type character varying(40) NOT NULL,
    prompt text NOT NULL,
    missing_keywords jsonb DEFAULT '[]'::jsonb NOT NULL,
    correct_answer jsonb,
    points numeric(8,2) NOT NULL,
    sequence_number integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: assessment_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_responses (
    id uuid NOT NULL,
    attempt_id uuid NOT NULL,
    question_id uuid NOT NULL,
    response jsonb NOT NULL,
    is_correct boolean,
    awarded_points numeric(8,2),
    graded_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: assessment_slot_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_slot_bookings (
    id uuid NOT NULL,
    slot_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status character varying(32) DEFAULT 'CONFIRMED'::character varying NOT NULL,
    booked_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: assessment_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_slots (
    id uuid NOT NULL,
    assessment_id uuid NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    capacity integer NOT NULL,
    booked_count integer DEFAULT 0 NOT NULL,
    status character varying(32) DEFAULT 'OPEN'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    assessment_type character varying(40) NOT NULL,
    scope_type character varying(32) NOT NULL,
    scope_id uuid,
    duration_minutes integer,
    maximum_score numeric(8,2) NOT NULL,
    passing_score numeric(8,2),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    actor_user_id uuid,
    action character varying(100) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id uuid NOT NULL,
    previous_value jsonb,
    new_value jsonb,
    ip_address inet,
    user_agent text,
    correlation_id uuid,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: badge_definitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badge_definitions (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(64) NOT NULL,
    description text,
    badge_type character varying(40) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    image_object_key character varying(2048),
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: candidate_match_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.candidate_match_results (
    id uuid NOT NULL,
    match_run_id uuid NOT NULL,
    student_id uuid NOT NULL,
    resume_version_id uuid,
    rank integer NOT NULL,
    match_score numeric(5,2) NOT NULL,
    missing_keywords jsonb DEFAULT '[]'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: candidate_match_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.candidate_match_runs (
    id uuid NOT NULL,
    candidate_search_id uuid,
    ai_run_id uuid NOT NULL,
    drive_id uuid,
    job_description_version_id uuid,
    status character varying(32) DEFAULT 'QUEUED'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: candidate_searches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.candidate_searches (
    id uuid NOT NULL,
    natural_language_query text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    company_id uuid,
    drive_id uuid,
    recruiter_id uuid,
    requested_by uuid NOT NULL,
    result_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: cohorts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cohorts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    program_id uuid NOT NULL,
    admission_year smallint NOT NULL,
    graduation_year smallint NOT NULL,
    batch_name character varying(100) NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    legal_name character varying(255),
    website_url character varying(2048),
    industry character varying(120),
    description text,
    headquarters character varying(255),
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: company_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_contacts (
    id uuid NOT NULL,
    company_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(32),
    designation character varying(120),
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: conversation_contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_contexts (
    id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    context_type character varying(40) NOT NULL,
    resource_id uuid NOT NULL,
    resource_version_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_participants (
    id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    participant_type character varying(32) NOT NULL,
    joined_at timestamp with time zone NOT NULL,
    left_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid NOT NULL,
    conversation_type character varying(40) NOT NULL,
    title character varying(255),
    created_by uuid,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: crm_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crm_activities (
    id uuid NOT NULL,
    pipeline_id uuid NOT NULL,
    company_id uuid NOT NULL,
    actor_user_id uuid,
    department_id uuid,
    activity_type character varying(32) NOT NULL,
    subject character varying(255),
    details text,
    occurred_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: crm_pipelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crm_pipelines (
    id uuid NOT NULL,
    company_id uuid NOT NULL,
    stage character varying(32) DEFAULT 'PROSPECT'::character varying NOT NULL,
    owner_user_id uuid,
    notes text,
    next_follow_up_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: data_access_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_access_audits (
    id uuid NOT NULL,
    resource_owner_id uuid NOT NULL,
    actor_user_id uuid NOT NULL,
    organization_id uuid,
    resource_type character varying(64) NOT NULL,
    resource_id uuid NOT NULL,
    resource_version character varying(32),
    access_type character varying(32) DEFAULT 'VIEW'::character varying NOT NULL,
    authorization_basis character varying(128) NOT NULL,
    purpose text,
    ip_address character varying(64),
    user_agent text,
    accessed_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: department_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_settings (
    id uuid NOT NULL,
    department_id uuid NOT NULL,
    student_registration_enabled boolean DEFAULT true NOT NULL,
    resume_approval_required boolean DEFAULT true NOT NULL,
    job_submission_enabled boolean DEFAULT true NOT NULL,
    alumni_chat_enabled boolean DEFAULT true NOT NULL,
    reward_system_enabled boolean DEFAULT true NOT NULL,
    minimum_profile_completion smallint DEFAULT 80 NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    institution_id uuid NOT NULL,
    department_head_user_id uuid,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: drive_departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drive_departments (
    id uuid NOT NULL,
    drive_id uuid NOT NULL,
    department_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: drive_rounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drive_rounds (
    id uuid NOT NULL,
    drive_id uuid NOT NULL,
    name character varying(120) NOT NULL,
    round_type character varying(64) NOT NULL,
    sequence_number smallint NOT NULL,
    scheduled_at timestamp with time zone,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: eligibility_evaluations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.eligibility_evaluations (
    id uuid NOT NULL,
    rule_set_id uuid NOT NULL,
    drive_id uuid NOT NULL,
    student_id uuid NOT NULL,
    eligible boolean NOT NULL,
    evaluation_snapshot jsonb NOT NULL,
    evaluated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: eligibility_rule_sets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.eligibility_rule_sets (
    id uuid NOT NULL,
    drive_id uuid NOT NULL,
    department_id uuid,
    version_number integer NOT NULL,
    rules jsonb NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    effective_from timestamp with time zone NOT NULL,
    created_by uuid,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: external_id_mappings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_id_mappings (
    id uuid NOT NULL,
    integration_connection_id uuid NOT NULL,
    entity_type character varying(64) NOT NULL,
    entity_id uuid NOT NULL,
    external_id character varying(255) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: global_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.global_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: institutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.institutions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_tenant_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    university_name character varying(255),
    timezone character varying(255) DEFAULT 'UTC'::character varying NOT NULL,
    status character varying(255) DEFAULT 'ACTIVE'::character varying NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: integration_connections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integration_connections (
    id uuid NOT NULL,
    integration_type character varying(32) NOT NULL,
    name character varying(255) NOT NULL,
    secret_reference character varying(255),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    last_synced_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    job_opportunity_id uuid NOT NULL,
    drive_id uuid,
    resume_version_id uuid NOT NULL,
    status character varying(32) DEFAULT 'SUBMITTED'::character varying NOT NULL,
    applied_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: job_description_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_description_versions (
    id uuid NOT NULL,
    job_opportunity_id uuid NOT NULL,
    version_number integer NOT NULL,
    content text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    content_hash character varying(128) NOT NULL,
    created_by uuid,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: job_offers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_offers (
    id uuid NOT NULL,
    application_id uuid NOT NULL,
    student_id uuid NOT NULL,
    job_opportunity_id uuid NOT NULL,
    company_id uuid,
    placement_tier_id uuid,
    status character varying(32) DEFAULT 'OFFERED'::character varying NOT NULL,
    compensation numeric(14,2),
    total_ctc numeric(14,2),
    currency character varying(8) DEFAULT 'INR'::character varying NOT NULL,
    offer_date date,
    decision_deadline timestamp with time zone,
    joining_date date,
    offer_letter_object_key character varying(2048),
    accepted_at timestamp with time zone,
    declined_at timestamp with time zone,
    decline_reason text,
    signed_document_object_key character varying(2048),
    signature_reference character varying(255),
    offered_at timestamp with time zone NOT NULL,
    responded_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: job_opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    placement_season_id uuid,
    title character varying(255) NOT NULL,
    source character varying(32) NOT NULL,
    employment_type character varying(32) NOT NULL,
    work_mode character varying(32) NOT NULL,
    location character varying(255),
    compensation_min numeric(14,2),
    compensation_max numeric(14,2),
    application_url character varying(2048),
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_by uuid,
    published_at timestamp with time zone,
    closes_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: knowledge_chunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_chunks (
    id uuid NOT NULL,
    knowledge_document_id uuid NOT NULL,
    chunk_index integer NOT NULL,
    content text NOT NULL,
    token_count integer,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: knowledge_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_documents (
    id uuid NOT NULL,
    source_type character varying(40) NOT NULL,
    source_id uuid NOT NULL,
    source_version_id uuid,
    title character varying(255) NOT NULL,
    content_hash character varying(128) NOT NULL,
    visibility_scope_type character varying(32) NOT NULL,
    visibility_scope_id uuid,
    owner_user_id uuid,
    department_id uuid,
    program_id uuid,
    cohort_id uuid,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: learning_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_comments (
    id uuid NOT NULL,
    learning_post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: learning_post_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_post_skills (
    id uuid NOT NULL,
    learning_post_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: learning_post_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_post_tags (
    id uuid NOT NULL,
    learning_post_id uuid NOT NULL,
    learning_tag_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: learning_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_posts (
    id uuid NOT NULL,
    author_user_id uuid NOT NULL,
    content_type character varying(32) NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    scope_type character varying(32) NOT NULL,
    scope_id uuid,
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: learning_reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_reactions (
    id uuid NOT NULL,
    learning_post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type character varying(32) NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: learning_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_resources (
    id uuid NOT NULL,
    learning_post_id uuid NOT NULL,
    resource_type character varying(32) NOT NULL,
    url character varying(2048),
    object_key character varying(2048),
    title character varying(255),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: learning_saves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_saves (
    id uuid NOT NULL,
    learning_post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: learning_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_tags (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(120) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: market_skill_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_skill_snapshots (
    id uuid NOT NULL,
    skill_id uuid,
    skill_name character varying(120) NOT NULL,
    market character varying(120) NOT NULL,
    demand_score numeric(7,4) NOT NULL,
    growth_score numeric(7,4),
    source character varying(120) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    captured_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: mentorship_availability_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mentorship_availability_slots (
    id uuid NOT NULL,
    alumni_id uuid NOT NULL,
    topic character varying(64) NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    duration_minutes integer DEFAULT 30 NOT NULL,
    meeting_link character varying(2048),
    is_booked boolean DEFAULT false NOT NULL,
    status character varying(32) DEFAULT 'AVAILABLE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: mentorship_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mentorship_bookings (
    id uuid NOT NULL,
    slot_id uuid NOT NULL,
    student_id uuid NOT NULL,
    alumni_id uuid NOT NULL,
    status character varying(32) DEFAULT 'SCHEDULED'::character varying NOT NULL,
    notes text,
    student_feedback text,
    alumni_feedback text,
    booked_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: message_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_attachments (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    object_key character varying(2048) NOT NULL,
    file_name character varying(255) NOT NULL,
    mime_type character varying(120) NOT NULL,
    size_bytes bigint,
    content_hash character varying(128),
    created_at timestamp with time zone NOT NULL
);


--
-- Name: message_citations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_citations (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    knowledge_chunk_id uuid NOT NULL,
    rank smallint NOT NULL,
    similarity_score numeric(8,7),
    quoted_text_start integer,
    quoted_text_end integer,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: message_read_receipts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_read_receipts (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    user_id uuid NOT NULL,
    read_at timestamp with time zone NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    sender_type character varying(32) NOT NULL,
    sender_user_id uuid,
    message_type character varying(32) DEFAULT 'TEXT'::character varying NOT NULL,
    content text NOT NULL,
    parent_message_id uuid,
    created_at timestamp with time zone NOT NULL,
    edited_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: notification_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_deliveries (
    id uuid NOT NULL,
    notification_id uuid NOT NULL,
    channel character varying(32) NOT NULL,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    provider character varying(64),
    provider_reference character varying(255),
    attempts smallint DEFAULT 0 NOT NULL,
    error_details jsonb,
    sent_at timestamp with time zone,
    delivered_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_preferences (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    channel character varying(32) NOT NULL,
    category character varying(64) NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    notification_type character varying(64) NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: offer_compensation_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offer_compensation_components (
    id uuid NOT NULL,
    job_offer_id uuid NOT NULL,
    component_type character varying(32) NOT NULL,
    amount numeric(14,2) NOT NULL,
    currency character varying(8) DEFAULT 'INR'::character varying NOT NULL,
    frequency character varying(32) DEFAULT 'ANNUAL'::character varying NOT NULL,
    description text,
    is_guaranteed boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: opportunity_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opportunity_submissions (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    company_name character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    source_url character varying(2048) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    status character varying(32) DEFAULT 'PENDING_VERIFICATION'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: opportunity_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opportunity_verifications (
    id uuid NOT NULL,
    submission_id uuid NOT NULL,
    verification_type character varying(64) NOT NULL,
    status character varying(32) NOT NULL,
    score numeric(5,2),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    checked_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    resource character varying(100) NOT NULL,
    action character varying(64) NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: placement_compliance_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_compliance_events (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    event_type character varying(64) NOT NULL,
    strike_delta smallint DEFAULT 0 NOT NULL,
    reason text NOT NULL,
    recorded_by uuid NOT NULL,
    drive_id uuid,
    application_id uuid,
    evidence_url character varying(2048),
    reversal_event_id uuid,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: placement_drives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_drives (
    id uuid NOT NULL,
    job_opportunity_id uuid NOT NULL,
    placement_season_id uuid NOT NULL,
    placement_tier_id uuid,
    name character varying(255) NOT NULL,
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: placement_policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_policies (
    id uuid NOT NULL,
    placement_season_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    scope_type character varying(32) NOT NULL,
    scope_id uuid,
    version_number integer NOT NULL,
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    effective_from timestamp with time zone NOT NULL,
    effective_until timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: placement_policy_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_policy_rules (
    id uuid NOT NULL,
    policy_id uuid NOT NULL,
    rule_type character varying(64) NOT NULL,
    priority smallint DEFAULT 0 NOT NULL,
    rule_definition jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: placement_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_records (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    placement_season_id uuid NOT NULL,
    job_offer_id uuid,
    company_id uuid NOT NULL,
    job_opportunity_id uuid,
    placement_type character varying(32) NOT NULL,
    role_title character varying(255) NOT NULL,
    compensation numeric(14,2),
    placed_at timestamp with time zone NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: placement_seasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_seasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: placement_tiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_tiers (
    id uuid NOT NULL,
    placement_season_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(32) NOT NULL,
    rank smallint NOT NULL,
    minimum_compensation numeric(14,2),
    maximum_compensation numeric(14,2),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: platform_admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_admins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    global_user_id uuid NOT NULL,
    access_level character varying(32) DEFAULT 'ADMIN'::character varying NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_settings (
    key character varying(100) NOT NULL,
    value jsonb DEFAULT '{}'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: proctor_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proctor_events (
    id uuid NOT NULL,
    proctor_session_id uuid NOT NULL,
    event_type character varying(64) NOT NULL,
    severity character varying(16) DEFAULT 'LOW'::character varying NOT NULL,
    evidence_object_key character varying(2048),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    occurred_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: proctor_preflights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proctor_preflights (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    assessment_id uuid NOT NULL,
    camera_passed boolean DEFAULT false NOT NULL,
    microphone_passed boolean DEFAULT false NOT NULL,
    network_passed boolean DEFAULT false NOT NULL,
    browser_passed boolean DEFAULT false NOT NULL,
    display_passed boolean DEFAULT false NOT NULL,
    identity_verified boolean DEFAULT false NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    completed_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: proctor_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proctor_sessions (
    id uuid NOT NULL,
    attempt_id uuid NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    risk_score numeric(5,2),
    started_at timestamp with time zone NOT NULL,
    ended_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    department_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(64) NOT NULL,
    degree_type character varying(64) NOT NULL,
    duration_years smallint NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: project_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_skills (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: recruiter_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recruiter_profiles (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    company_id uuid NOT NULL,
    designation character varying(120),
    verification_status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: recruitment_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recruitment_visits (
    id uuid NOT NULL,
    company_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    visit_at timestamp with time zone NOT NULL,
    location character varying(255),
    status character varying(32) DEFAULT 'SCHEDULED'::character varying NOT NULL,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: referral_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_posts (
    id uuid NOT NULL,
    alumni_id uuid NOT NULL,
    company_id uuid,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    closes_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: referral_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_requests (
    id uuid NOT NULL,
    referral_post_id uuid NOT NULL,
    student_id uuid NOT NULL,
    resume_version_id uuid NOT NULL,
    message text,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    responded_at timestamp with time zone,
    outcome character varying(32),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: resume_analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_analyses (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    resume_version_id uuid NOT NULL,
    job_opportunity_id uuid,
    job_description_version_id uuid,
    ai_run_id uuid NOT NULL,
    match_score numeric(5,2),
    keyword_score numeric(5,2),
    experience_score numeric(5,2),
    skills_score numeric(5,2),
    education_score numeric(5,2),
    missing_keywords jsonb DEFAULT '[]'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: resume_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_versions (
    id uuid NOT NULL,
    resume_id uuid NOT NULL,
    file_object_key character varying(2048) NOT NULL,
    parsed_text text,
    parsed_data jsonb,
    content_hash character varying(128) NOT NULL,
    version_number integer NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: resumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resumes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    name character varying(200) NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: role_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_assignments (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    scope_type character varying(32) NOT NULL,
    scope_id uuid,
    valid_from timestamp with time zone NOT NULL,
    valid_until timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id uuid NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(64) NOT NULL,
    description text,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: saved_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_items (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    student_id uuid,
    item_type character varying(32) NOT NULL,
    item_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: skill_evidence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_evidence (
    id uuid NOT NULL,
    student_skill_id uuid NOT NULL,
    evidence_type character varying(40) NOT NULL,
    reference_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: skill_gap_analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_gap_analyses (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    target_role character varying(255) NOT NULL,
    job_opportunity_id uuid,
    resume_version_id uuid,
    ai_run_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: skill_gap_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_gap_items (
    id uuid NOT NULL,
    skill_gap_analysis_id uuid NOT NULL,
    skill_id uuid,
    skill_name character varying(120) NOT NULL,
    status character varying(32) NOT NULL,
    current_level character varying(32),
    target_level character varying(32),
    priority smallint DEFAULT 0 NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(120) NOT NULL,
    slug character varying(140) NOT NULL,
    category character varying(100),
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_academic_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_academic_memberships (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    department_id uuid NOT NULL,
    program_id uuid NOT NULL,
    cohort_id uuid NOT NULL,
    effective_from timestamp with time zone NOT NULL,
    effective_to timestamp with time zone,
    is_current boolean DEFAULT true NOT NULL,
    change_reason text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_academic_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_academic_records (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    record_type character varying(64) NOT NULL,
    semester character varying(32),
    cgpa numeric(5,2),
    sgpa numeric(5,2),
    percentage numeric(5,2),
    active_backlogs smallint DEFAULT 0 NOT NULL,
    total_backlogs smallint DEFAULT 0 NOT NULL,
    source_type character varying(64) NOT NULL,
    source_reference character varying(255),
    verified boolean DEFAULT false NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    effective_from timestamp with time zone NOT NULL,
    effective_until timestamp with time zone,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: student_action_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_action_items (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    action_type character varying(64) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    priority character varying(32) DEFAULT 'MEDIUM'::character varying NOT NULL,
    deadline timestamp with time zone,
    action_url character varying(2048),
    target_entity_type character varying(64),
    target_entity_id uuid,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_badges (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    badge_definition_id uuid NOT NULL,
    assessment_attempt_id uuid,
    evidence_type character varying(40),
    evidence_id uuid,
    issued_by uuid,
    issued_at timestamp with time zone NOT NULL,
    expires_at timestamp with time zone,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: student_career_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_career_profiles (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    headline character varying(200),
    bio text,
    preferred_roles character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[] NOT NULL,
    preferred_locations character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[] NOT NULL,
    preferred_work_modes character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[] NOT NULL,
    expected_salary_min numeric(14,2),
    expected_salary_max numeric(14,2),
    linkedin_url character varying(2048),
    github_url character varying(2048),
    portfolio_url character varying(2048),
    open_to_work boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_placement_compliance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_placement_compliance (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    active_strikes integer DEFAULT 0 NOT NULL,
    total_strikes integer DEFAULT 0 NOT NULL,
    compliance_status character varying(32) DEFAULT 'GOOD_STANDING'::character varying NOT NULL,
    debarred_until timestamp with time zone,
    last_event_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_privacy_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_privacy_preferences (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    recruiter_discovery_enabled boolean DEFAULT true NOT NULL,
    resume_visibility character varying(32) DEFAULT 'VERIFIED_ONLY'::character varying NOT NULL,
    alumni_connection_enabled boolean DEFAULT true NOT NULL,
    learning_profile_visibility character varying(32) DEFAULT 'CAMPUS_ONLY'::character varying NOT NULL,
    assessment_visibility character varying(32) DEFAULT 'CAMPUS_ONLY'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    department_id uuid NOT NULL,
    program_id uuid NOT NULL,
    cohort_id uuid NOT NULL,
    roll_number character varying(255) NOT NULL,
    prn_number character varying(255),
    placement_status character varying(255) DEFAULT 'SEEKING'::character varying NOT NULL,
    profile_completion_percent smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_projects (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    summary character varying(500),
    description text NOT NULL,
    project_type character varying(64) DEFAULT 'ACADEMIC'::character varying NOT NULL,
    student_role character varying(128),
    contribution_description text,
    impact_description text,
    github_url character varying(2048),
    project_url character varying(2048),
    missing_keywords jsonb DEFAULT '[]'::jsonb NOT NULL,
    start_date date,
    end_date date,
    is_ongoing boolean DEFAULT false NOT NULL,
    visibility character varying(32) DEFAULT 'COLLEGE'::character varying NOT NULL,
    verification_status character varying(32) DEFAULT 'UNVERIFIED'::character varying NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_requests (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    request_type character varying(64) NOT NULL,
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    title character varying(255) NOT NULL,
    details text NOT NULL,
    supporting_document_url character varying(2048),
    target_entity_type character varying(64),
    target_entity_id uuid,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    reviewer_notes text,
    generated_document_key character varying(512),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_round_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_round_results (
    id uuid NOT NULL,
    application_id uuid NOT NULL,
    drive_round_id uuid NOT NULL,
    status character varying(32) NOT NULL,
    score numeric(7,2),
    notes text,
    evaluated_by uuid,
    evaluated_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: student_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_skills (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    proficiency_level character varying(32),
    verification_status character varying(40) DEFAULT 'SELF_DECLARED'::character varying NOT NULL,
    verified_score numeric(5,2),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: submission_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submission_reviews (
    id uuid NOT NULL,
    submission_id uuid NOT NULL,
    reviewer_user_id uuid NOT NULL,
    decision character varying(32) NOT NULL,
    notes text,
    published_job_id uuid,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    plan_code character varying(64) NOT NULL,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    starts_at timestamp with time zone DEFAULT now() NOT NULL,
    ends_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sync_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sync_jobs (
    id uuid NOT NULL,
    integration_connection_id uuid NOT NULL,
    job_type character varying(64) NOT NULL,
    status character varying(32) DEFAULT 'QUEUED'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    records_processed integer DEFAULT 0 NOT NULL,
    records_failed integer DEFAULT 0 NOT NULL,
    error_details jsonb,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: tenant_databases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_databases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    provider character varying(32) DEFAULT 'PostgreSQL 17'::character varying NOT NULL,
    database_name character varying(255) NOT NULL,
    host_reference character varying(255) NOT NULL,
    secret_reference character varying(255) NOT NULL,
    region character varying(64) DEFAULT 'ap-south-1 (Mumbai)'::character varying,
    schema_version character varying(64) DEFAULT 'v28'::character varying NOT NULL,
    status character varying(32) DEFAULT 'HEALTHY'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tenant_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_memberships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    global_user_id uuid NOT NULL,
    local_user_id uuid,
    status character varying(32) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tenant_provisioning_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_provisioning_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    status character varying(32) DEFAULT 'QUEUED'::character varying NOT NULL,
    current_step character varying(64),
    attempts smallint DEFAULT 0 NOT NULL,
    error_details jsonb,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    college_code character(4) NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    institution_type character varying(64) NOT NULL,
    status character varying(32) DEFAULT 'PROVISIONING'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    activated_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_agreements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_agreements (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    student_id uuid,
    agreement_type character varying(64) NOT NULL,
    agreement_version character varying(32) DEFAULT '1.0'::character varying NOT NULL,
    document_name character varying(255) NOT NULL,
    document_hash character varying(128) NOT NULL,
    document_object_key character varying(2048),
    accepted_at timestamp with time zone NOT NULL,
    ip_address character varying(64),
    user_agent text,
    signature_data text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    global_user_id uuid,
    email character varying(255) NOT NULL,
    phone character varying(255),
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    avatar_url character varying(255),
    status character varying(255) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: academic_events academic_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_events
    ADD CONSTRAINT academic_events_pkey PRIMARY KEY (id);


--
-- Name: ai_credit_events ai_credit_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_credit_events
    ADD CONSTRAINT ai_credit_events_pkey PRIMARY KEY (id);


--
-- Name: ai_message_metadata ai_message_metadata_message_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_metadata
    ADD CONSTRAINT ai_message_metadata_message_id_key UNIQUE (message_id);


--
-- Name: ai_message_metadata ai_message_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_metadata
    ADD CONSTRAINT ai_message_metadata_pkey PRIMARY KEY (id);


--
-- Name: ai_runs ai_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_runs
    ADD CONSTRAINT ai_runs_pkey PRIMARY KEY (id);


--
-- Name: ai_usage_quotas ai_usage_quotas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage_quotas
    ADD CONSTRAINT ai_usage_quotas_pkey PRIMARY KEY (id);


--
-- Name: alumni_connection_requests alumni_connection_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_connection_requests
    ADD CONSTRAINT alumni_connection_requests_pkey PRIMARY KEY (id);


--
-- Name: alumni_employments alumni_employments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_employments
    ADD CONSTRAINT alumni_employments_pkey PRIMARY KEY (id);


--
-- Name: alumni_profiles alumni_profiles_former_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_profiles
    ADD CONSTRAINT alumni_profiles_former_student_id_key UNIQUE (former_student_id);


--
-- Name: alumni_profiles alumni_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_profiles
    ADD CONSTRAINT alumni_profiles_pkey PRIMARY KEY (id);


--
-- Name: alumni_profiles alumni_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_profiles
    ADD CONSTRAINT alumni_profiles_user_id_key UNIQUE (user_id);


--
-- Name: application_status_history application_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_pkey PRIMARY KEY (id);


--
-- Name: artifact_attestations artifact_attestations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artifact_attestations
    ADD CONSTRAINT artifact_attestations_pkey PRIMARY KEY (id);


--
-- Name: assessment_assignments assessment_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_assignments
    ADD CONSTRAINT assessment_assignments_pkey PRIMARY KEY (id);


--
-- Name: assessment_attempts assessment_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_pkey PRIMARY KEY (id);


--
-- Name: assessment_questions assessment_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_questions
    ADD CONSTRAINT assessment_questions_pkey PRIMARY KEY (id);


--
-- Name: assessment_responses assessment_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_responses
    ADD CONSTRAINT assessment_responses_pkey PRIMARY KEY (id);


--
-- Name: assessment_slot_bookings assessment_slot_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_slot_bookings
    ADD CONSTRAINT assessment_slot_bookings_pkey PRIMARY KEY (id);


--
-- Name: assessment_slots assessment_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_slots
    ADD CONSTRAINT assessment_slots_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: badge_definitions badge_definitions_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_code_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key1 UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_code_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key2 UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_code_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key3 UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_code_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key4 UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_code_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key5 UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_code_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_code_key6 UNIQUE (code);


--
-- Name: badge_definitions badge_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_pkey PRIMARY KEY (id);


--
-- Name: candidate_match_results candidate_match_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_results
    ADD CONSTRAINT candidate_match_results_pkey PRIMARY KEY (id);


--
-- Name: candidate_match_runs candidate_match_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_runs
    ADD CONSTRAINT candidate_match_runs_pkey PRIMARY KEY (id);


--
-- Name: candidate_searches candidate_searches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_searches
    ADD CONSTRAINT candidate_searches_pkey PRIMARY KEY (id);


--
-- Name: cohorts cohorts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cohorts
    ADD CONSTRAINT cohorts_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: company_contacts company_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_contacts
    ADD CONSTRAINT company_contacts_pkey PRIMARY KEY (id);


--
-- Name: conversation_contexts conversation_contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_contexts
    ADD CONSTRAINT conversation_contexts_pkey PRIMARY KEY (id);


--
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: crm_activities crm_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_pkey PRIMARY KEY (id);


--
-- Name: crm_pipelines crm_pipelines_company_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_pipelines
    ADD CONSTRAINT crm_pipelines_company_id_key UNIQUE (company_id);


--
-- Name: crm_pipelines crm_pipelines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_pipelines
    ADD CONSTRAINT crm_pipelines_pkey PRIMARY KEY (id);


--
-- Name: data_access_audits data_access_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_access_audits
    ADD CONSTRAINT data_access_audits_pkey PRIMARY KEY (id);


--
-- Name: department_settings department_settings_department_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_settings
    ADD CONSTRAINT department_settings_department_id_key UNIQUE (department_id);


--
-- Name: department_settings department_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_settings
    ADD CONSTRAINT department_settings_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: drive_departments drive_departments_drive_id_department_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drive_departments
    ADD CONSTRAINT drive_departments_drive_id_department_id_key UNIQUE (drive_id, department_id);


--
-- Name: drive_departments drive_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drive_departments
    ADD CONSTRAINT drive_departments_pkey PRIMARY KEY (id);


--
-- Name: drive_rounds drive_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drive_rounds
    ADD CONSTRAINT drive_rounds_pkey PRIMARY KEY (id);


--
-- Name: eligibility_evaluations eligibility_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_evaluations
    ADD CONSTRAINT eligibility_evaluations_pkey PRIMARY KEY (id);


--
-- Name: eligibility_rule_sets eligibility_rule_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_rule_sets
    ADD CONSTRAINT eligibility_rule_sets_pkey PRIMARY KEY (id);


--
-- Name: external_id_mappings external_id_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_id_mappings
    ADD CONSTRAINT external_id_mappings_pkey PRIMARY KEY (id);


--
-- Name: global_users global_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_users
    ADD CONSTRAINT global_users_email_key UNIQUE (email);


--
-- Name: global_users global_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_users
    ADD CONSTRAINT global_users_pkey PRIMARY KEY (id);


--
-- Name: institutions institutions_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key UNIQUE (code);


--
-- Name: institutions institutions_code_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key1 UNIQUE (code);


--
-- Name: institutions institutions_code_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key2 UNIQUE (code);


--
-- Name: institutions institutions_code_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key3 UNIQUE (code);


--
-- Name: institutions institutions_code_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key4 UNIQUE (code);


--
-- Name: institutions institutions_code_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key5 UNIQUE (code);


--
-- Name: institutions institutions_code_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_code_key6 UNIQUE (code);


--
-- Name: institutions institutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (id);


--
-- Name: integration_connections integration_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_connections
    ADD CONSTRAINT integration_connections_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: job_description_versions job_description_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_description_versions
    ADD CONSTRAINT job_description_versions_pkey PRIMARY KEY (id);


--
-- Name: job_offers job_offers_application_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_application_id_key UNIQUE (application_id);


--
-- Name: job_offers job_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_pkey PRIMARY KEY (id);


--
-- Name: job_opportunities job_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_opportunities
    ADD CONSTRAINT job_opportunities_pkey PRIMARY KEY (id);


--
-- Name: knowledge_chunks knowledge_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_chunks
    ADD CONSTRAINT knowledge_chunks_pkey PRIMARY KEY (id);


--
-- Name: knowledge_documents knowledge_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_documents
    ADD CONSTRAINT knowledge_documents_pkey PRIMARY KEY (id);


--
-- Name: learning_comments learning_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_comments
    ADD CONSTRAINT learning_comments_pkey PRIMARY KEY (id);


--
-- Name: learning_post_skills learning_post_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_skills
    ADD CONSTRAINT learning_post_skills_pkey PRIMARY KEY (id);


--
-- Name: learning_post_tags learning_post_tags_learning_post_id_learning_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_tags
    ADD CONSTRAINT learning_post_tags_learning_post_id_learning_tag_id_key UNIQUE (learning_post_id, learning_tag_id);


--
-- Name: learning_post_tags learning_post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_tags
    ADD CONSTRAINT learning_post_tags_pkey PRIMARY KEY (id);


--
-- Name: learning_posts learning_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_posts
    ADD CONSTRAINT learning_posts_pkey PRIMARY KEY (id);


--
-- Name: learning_reactions learning_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_reactions
    ADD CONSTRAINT learning_reactions_pkey PRIMARY KEY (id);


--
-- Name: learning_resources learning_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_resources
    ADD CONSTRAINT learning_resources_pkey PRIMARY KEY (id);


--
-- Name: learning_saves learning_saves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_saves
    ADD CONSTRAINT learning_saves_pkey PRIMARY KEY (id);


--
-- Name: learning_tags learning_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_tags
    ADD CONSTRAINT learning_tags_pkey PRIMARY KEY (id);


--
-- Name: learning_tags learning_tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_tags
    ADD CONSTRAINT learning_tags_slug_key UNIQUE (slug);


--
-- Name: market_skill_snapshots market_skill_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_skill_snapshots
    ADD CONSTRAINT market_skill_snapshots_pkey PRIMARY KEY (id);


--
-- Name: mentorship_availability_slots mentorship_availability_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentorship_availability_slots
    ADD CONSTRAINT mentorship_availability_slots_pkey PRIMARY KEY (id);


--
-- Name: mentorship_bookings mentorship_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentorship_bookings
    ADD CONSTRAINT mentorship_bookings_pkey PRIMARY KEY (id);


--
-- Name: message_attachments message_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_pkey PRIMARY KEY (id);


--
-- Name: message_citations message_citations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_citations
    ADD CONSTRAINT message_citations_pkey PRIMARY KEY (id);


--
-- Name: message_read_receipts message_read_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_read_receipts
    ADD CONSTRAINT message_read_receipts_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notification_deliveries notification_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_deliveries
    ADD CONSTRAINT notification_deliveries_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: offer_compensation_components offer_compensation_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_compensation_components
    ADD CONSTRAINT offer_compensation_components_pkey PRIMARY KEY (id);


--
-- Name: opportunity_submissions opportunity_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunity_submissions
    ADD CONSTRAINT opportunity_submissions_pkey PRIMARY KEY (id);


--
-- Name: opportunity_verifications opportunity_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunity_verifications
    ADD CONSTRAINT opportunity_verifications_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: placement_compliance_events placement_compliance_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_compliance_events
    ADD CONSTRAINT placement_compliance_events_pkey PRIMARY KEY (id);


--
-- Name: placement_drives placement_drives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_pkey PRIMARY KEY (id);


--
-- Name: placement_policies placement_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_policies
    ADD CONSTRAINT placement_policies_pkey PRIMARY KEY (id);


--
-- Name: placement_policy_rules placement_policy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_policy_rules
    ADD CONSTRAINT placement_policy_rules_pkey PRIMARY KEY (id);


--
-- Name: placement_records placement_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_records
    ADD CONSTRAINT placement_records_pkey PRIMARY KEY (id);


--
-- Name: placement_seasons placement_seasons_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key1 UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key2 UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key3 UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key4 UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key5 UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_name_key6 UNIQUE (name);


--
-- Name: placement_seasons placement_seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_seasons
    ADD CONSTRAINT placement_seasons_pkey PRIMARY KEY (id);


--
-- Name: placement_tiers placement_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_tiers
    ADD CONSTRAINT placement_tiers_pkey PRIMARY KEY (id);


--
-- Name: platform_admins platform_admins_global_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_admins
    ADD CONSTRAINT platform_admins_global_user_id_key UNIQUE (global_user_id);


--
-- Name: platform_admins platform_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_admins
    ADD CONSTRAINT platform_admins_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (key);


--
-- Name: proctor_events proctor_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_events
    ADD CONSTRAINT proctor_events_pkey PRIMARY KEY (id);


--
-- Name: proctor_preflights proctor_preflights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_preflights
    ADD CONSTRAINT proctor_preflights_pkey PRIMARY KEY (id);


--
-- Name: proctor_sessions proctor_sessions_attempt_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_sessions
    ADD CONSTRAINT proctor_sessions_attempt_id_key UNIQUE (attempt_id);


--
-- Name: proctor_sessions proctor_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_sessions
    ADD CONSTRAINT proctor_sessions_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: project_skills project_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_skills
    ADD CONSTRAINT project_skills_pkey PRIMARY KEY (id);


--
-- Name: recruiter_profiles recruiter_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter_profiles
    ADD CONSTRAINT recruiter_profiles_pkey PRIMARY KEY (id);


--
-- Name: recruiter_profiles recruiter_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter_profiles
    ADD CONSTRAINT recruiter_profiles_user_id_key UNIQUE (user_id);


--
-- Name: recruitment_visits recruitment_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruitment_visits
    ADD CONSTRAINT recruitment_visits_pkey PRIMARY KEY (id);


--
-- Name: referral_posts referral_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_posts
    ADD CONSTRAINT referral_posts_pkey PRIMARY KEY (id);


--
-- Name: referral_requests referral_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_requests
    ADD CONSTRAINT referral_requests_pkey PRIMARY KEY (id);


--
-- Name: resume_analyses resume_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_pkey PRIMARY KEY (id);


--
-- Name: resume_versions resume_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_versions
    ADD CONSTRAINT resume_versions_pkey PRIMARY KEY (id);


--
-- Name: resumes resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_pkey PRIMARY KEY (id);


--
-- Name: role_assignments role_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_assignments
    ADD CONSTRAINT role_assignments_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: saved_items saved_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_items
    ADD CONSTRAINT saved_items_pkey PRIMARY KEY (id);


--
-- Name: skill_evidence skill_evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evidence
    ADD CONSTRAINT skill_evidence_pkey PRIMARY KEY (id);


--
-- Name: skill_gap_analyses skill_gap_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_analyses
    ADD CONSTRAINT skill_gap_analyses_pkey PRIMARY KEY (id);


--
-- Name: skill_gap_items skill_gap_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_items
    ADD CONSTRAINT skill_gap_items_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: skills skills_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key UNIQUE (slug);


--
-- Name: skills skills_slug_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key1 UNIQUE (slug);


--
-- Name: skills skills_slug_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key2 UNIQUE (slug);


--
-- Name: skills skills_slug_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key3 UNIQUE (slug);


--
-- Name: skills skills_slug_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key4 UNIQUE (slug);


--
-- Name: skills skills_slug_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key5 UNIQUE (slug);


--
-- Name: skills skills_slug_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_slug_key6 UNIQUE (slug);


--
-- Name: student_academic_memberships student_academic_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_memberships
    ADD CONSTRAINT student_academic_memberships_pkey PRIMARY KEY (id);


--
-- Name: student_academic_records student_academic_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_records
    ADD CONSTRAINT student_academic_records_pkey PRIMARY KEY (id);


--
-- Name: student_action_items student_action_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_action_items
    ADD CONSTRAINT student_action_items_pkey PRIMARY KEY (id);


--
-- Name: student_badges student_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_badges
    ADD CONSTRAINT student_badges_pkey PRIMARY KEY (id);


--
-- Name: student_career_profiles student_career_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_career_profiles
    ADD CONSTRAINT student_career_profiles_pkey PRIMARY KEY (id);


--
-- Name: student_career_profiles student_career_profiles_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_career_profiles
    ADD CONSTRAINT student_career_profiles_student_id_key UNIQUE (student_id);


--
-- Name: student_placement_compliance student_placement_compliance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_placement_compliance
    ADD CONSTRAINT student_placement_compliance_pkey PRIMARY KEY (id);


--
-- Name: student_placement_compliance student_placement_compliance_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_placement_compliance
    ADD CONSTRAINT student_placement_compliance_student_id_key UNIQUE (student_id);


--
-- Name: student_privacy_preferences student_privacy_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_privacy_preferences
    ADD CONSTRAINT student_privacy_preferences_pkey PRIMARY KEY (id);


--
-- Name: student_privacy_preferences student_privacy_preferences_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_privacy_preferences
    ADD CONSTRAINT student_privacy_preferences_student_id_key UNIQUE (student_id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_key UNIQUE (user_id);


--
-- Name: student_projects student_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_projects
    ADD CONSTRAINT student_projects_pkey PRIMARY KEY (id);


--
-- Name: student_requests student_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_requests
    ADD CONSTRAINT student_requests_pkey PRIMARY KEY (id);


--
-- Name: student_round_results student_round_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_round_results
    ADD CONSTRAINT student_round_results_pkey PRIMARY KEY (id);


--
-- Name: student_skills student_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_pkey PRIMARY KEY (id);


--
-- Name: submission_reviews submission_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_reviews
    ADD CONSTRAINT submission_reviews_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: sync_jobs sync_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync_jobs
    ADD CONSTRAINT sync_jobs_pkey PRIMARY KEY (id);


--
-- Name: tenant_databases tenant_databases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_databases
    ADD CONSTRAINT tenant_databases_pkey PRIMARY KEY (id);


--
-- Name: tenant_databases tenant_databases_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_databases
    ADD CONSTRAINT tenant_databases_tenant_id_key UNIQUE (tenant_id);


--
-- Name: tenant_memberships tenant_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_pkey PRIMARY KEY (id);


--
-- Name: tenant_memberships tenant_memberships_tenant_id_global_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_tenant_id_global_user_id_key UNIQUE (tenant_id, global_user_id);


--
-- Name: tenant_provisioning_jobs tenant_provisioning_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_provisioning_jobs
    ADD CONSTRAINT tenant_provisioning_jobs_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_college_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_college_code_key UNIQUE (college_code);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_slug_key UNIQUE (slug);


--
-- Name: user_agreements user_agreements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agreements
    ADD CONSTRAINT user_agreements_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: academic_events_cohort_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX academic_events_cohort_id ON public.academic_events USING btree (cohort_id);


--
-- Name: academic_events_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX academic_events_department_id ON public.academic_events USING btree (department_id);


--
-- Name: academic_events_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX academic_events_event_type ON public.academic_events USING btree (event_type);


--
-- Name: academic_events_program_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX academic_events_program_id ON public.academic_events USING btree (program_id);


--
-- Name: academic_events_starts_at_ends_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX academic_events_starts_at_ends_at ON public.academic_events USING btree (starts_at, ends_at);


--
-- Name: ai_credit_events_ai_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_credit_events_ai_run_id ON public.ai_credit_events USING btree (ai_run_id);


--
-- Name: ai_credit_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_credit_events_created_at ON public.ai_credit_events USING btree (created_at);


--
-- Name: ai_credit_events_quota_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_credit_events_quota_id ON public.ai_credit_events USING btree (quota_id);


--
-- Name: ai_credit_events_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_credit_events_user_id ON public.ai_credit_events USING btree (user_id);


--
-- Name: ai_runs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_runs_created_at ON public.ai_runs USING btree (created_at);


--
-- Name: ai_runs_run_type_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_runs_run_type_status ON public.ai_runs USING btree (run_type, status);


--
-- Name: ai_usage_records_client_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_usage_records_client_created ON public.ai_usage_records USING btree (client_id, created_at DESC);


--
-- Name: ai_usage_records_signature_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_usage_records_signature_created ON public.ai_usage_records USING btree (signature_type, created_at DESC);


--
-- Name: ai_usage_records_status_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_usage_records_status_created ON public.ai_usage_records USING btree (status, created_at DESC);


--
-- Name: ai_usage_quotas_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_usage_quotas_is_active ON public.ai_usage_quotas USING btree (is_active);


--
-- Name: ai_usage_quotas_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ai_usage_quotas_scope_type_scope_id ON public.ai_usage_quotas USING btree (scope_type, scope_id);


--
-- Name: alumni_connection_requests_alumni_id_student_id_request_type_st; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX alumni_connection_requests_alumni_id_student_id_request_type_st ON public.alumni_connection_requests USING btree (alumni_id, student_id, request_type, status);


--
-- Name: alumni_connection_requests_student_id_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX alumni_connection_requests_student_id_status ON public.alumni_connection_requests USING btree (student_id, status);


--
-- Name: alumni_employments_alumni_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX alumni_employments_alumni_id ON public.alumni_employments USING btree (alumni_id);


--
-- Name: alumni_employments_company_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX alumni_employments_company_name ON public.alumni_employments USING btree (company_name);


--
-- Name: alumni_profiles_graduation_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX alumni_profiles_graduation_year ON public.alumni_profiles USING btree (graduation_year);


--
-- Name: application_status_history_application_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX application_status_history_application_id_created_at ON public.application_status_history USING btree (application_id, created_at);


--
-- Name: artifact_attestations_artifact_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artifact_attestations_artifact_hash ON public.artifact_attestations USING btree (artifact_hash);


--
-- Name: artifact_attestations_artifact_type_artifact_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artifact_attestations_artifact_type_artifact_id ON public.artifact_attestations USING btree (artifact_type, artifact_id);


--
-- Name: artifact_attestations_attested_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artifact_attestations_attested_at ON public.artifact_attestations USING btree (attested_at);


--
-- Name: artifact_attestations_signer_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artifact_attestations_signer_user_id ON public.artifact_attestations USING btree (signer_user_id);


--
-- Name: assessment_assignments_assessment_id_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_assignments_assessment_id_scope_type_scope_id ON public.assessment_assignments USING btree (assessment_id, scope_type, scope_id);


--
-- Name: assessment_assignments_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_assignments_scope_type_scope_id ON public.assessment_assignments USING btree (scope_type, scope_id);


--
-- Name: assessment_attempts_assessment_id_student_id_attempt_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_attempts_assessment_id_student_id_attempt_number ON public.assessment_attempts USING btree (assessment_id, student_id, attempt_number);


--
-- Name: assessment_attempts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_attempts_status ON public.assessment_attempts USING btree (status);


--
-- Name: assessment_attempts_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_attempts_student_id ON public.assessment_attempts USING btree (student_id);


--
-- Name: assessment_questions_assessment_id_sequence_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_questions_assessment_id_sequence_number ON public.assessment_questions USING btree (assessment_id, sequence_number);


--
-- Name: assessment_responses_attempt_id_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_responses_attempt_id_question_id ON public.assessment_responses USING btree (attempt_id, question_id);


--
-- Name: assessment_slot_bookings_slot_id_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_slot_bookings_slot_id_student_id ON public.assessment_slot_bookings USING btree (slot_id, student_id);


--
-- Name: assessment_slot_bookings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_slot_bookings_status ON public.assessment_slot_bookings USING btree (status);


--
-- Name: assessment_slot_bookings_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_slot_bookings_student_id ON public.assessment_slot_bookings USING btree (student_id);


--
-- Name: assessment_slots_assessment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_slots_assessment_id ON public.assessment_slots USING btree (assessment_id);


--
-- Name: assessment_slots_starts_at_ends_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_slots_starts_at_ends_at ON public.assessment_slots USING btree (starts_at, ends_at);


--
-- Name: assessment_slots_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_slots_status ON public.assessment_slots USING btree (status);


--
-- Name: assessments_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_scope_type_scope_id ON public.assessments USING btree (scope_type, scope_id);


--
-- Name: assessments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_status ON public.assessments USING btree (status);


--
-- Name: audit_logs_actor_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_actor_user_id ON public.audit_logs USING btree (actor_user_id);


--
-- Name: audit_logs_correlation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_correlation_id ON public.audit_logs USING btree (correlation_id);


--
-- Name: audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_type_entity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_entity_type_entity_id ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: candidate_match_results_match_run_id_rank; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX candidate_match_results_match_run_id_rank ON public.candidate_match_results USING btree (match_run_id, rank);


--
-- Name: candidate_match_results_match_run_id_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX candidate_match_results_match_run_id_student_id ON public.candidate_match_results USING btree (match_run_id, student_id);


--
-- Name: candidate_match_runs_candidate_search_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX candidate_match_runs_candidate_search_id ON public.candidate_match_runs USING btree (candidate_search_id);


--
-- Name: candidate_match_runs_drive_id_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX candidate_match_runs_drive_id_status ON public.candidate_match_runs USING btree (drive_id, status);


--
-- Name: candidate_searches_drive_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX candidate_searches_drive_id ON public.candidate_searches USING btree (drive_id);


--
-- Name: candidate_searches_requested_by_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX candidate_searches_requested_by_created_at ON public.candidate_searches USING btree (requested_by, created_at);


--
-- Name: companies_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX companies_industry ON public.companies USING btree (industry);


--
-- Name: companies_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX companies_name ON public.companies USING btree (name);


--
-- Name: company_contacts_company_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_contacts_company_id ON public.company_contacts USING btree (company_id);


--
-- Name: company_contacts_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_contacts_email ON public.company_contacts USING btree (email);


--
-- Name: conversation_contexts_context_type_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX conversation_contexts_context_type_resource_id ON public.conversation_contexts USING btree (context_type, resource_id);


--
-- Name: conversation_contexts_conversation_id_context_type_resource_id_; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX conversation_contexts_conversation_id_context_type_resource_id_ ON public.conversation_contexts USING btree (conversation_id, context_type, resource_id, resource_version_id);


--
-- Name: conversation_participants_conversation_id_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX conversation_participants_conversation_id_user_id ON public.conversation_participants USING btree (conversation_id, user_id);


--
-- Name: conversation_participants_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX conversation_participants_user_id ON public.conversation_participants USING btree (user_id);


--
-- Name: conversations_conversation_type_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX conversations_conversation_type_status ON public.conversations USING btree (conversation_type, status);


--
-- Name: conversations_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX conversations_created_by ON public.conversations USING btree (created_by);


--
-- Name: crm_activities_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crm_activities_department_id ON public.crm_activities USING btree (department_id);


--
-- Name: crm_activities_pipeline_id_occurred_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crm_activities_pipeline_id_occurred_at ON public.crm_activities USING btree (pipeline_id, occurred_at);


--
-- Name: crm_pipelines_owner_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crm_pipelines_owner_user_id ON public.crm_pipelines USING btree (owner_user_id);


--
-- Name: crm_pipelines_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crm_pipelines_stage ON public.crm_pipelines USING btree (stage);


--
-- Name: data_access_audits_accessed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX data_access_audits_accessed_at ON public.data_access_audits USING btree (accessed_at);


--
-- Name: data_access_audits_actor_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX data_access_audits_actor_user_id ON public.data_access_audits USING btree (actor_user_id);


--
-- Name: data_access_audits_resource_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX data_access_audits_resource_owner_id ON public.data_access_audits USING btree (resource_owner_id);


--
-- Name: data_access_audits_resource_type_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX data_access_audits_resource_type_resource_id ON public.data_access_audits USING btree (resource_type, resource_id);


--
-- Name: drive_departments_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX drive_departments_department_id ON public.drive_departments USING btree (department_id);


--
-- Name: drive_departments_drive_id_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX drive_departments_drive_id_department_id ON public.drive_departments USING btree (drive_id, department_id);


--
-- Name: drive_rounds_drive_id_sequence_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX drive_rounds_drive_id_sequence_number ON public.drive_rounds USING btree (drive_id, sequence_number);


--
-- Name: eligibility_evaluations_drive_id_eligible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX eligibility_evaluations_drive_id_eligible ON public.eligibility_evaluations USING btree (drive_id, eligible);


--
-- Name: eligibility_evaluations_rule_set_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX eligibility_evaluations_rule_set_id ON public.eligibility_evaluations USING btree (rule_set_id);


--
-- Name: eligibility_evaluations_student_id_drive_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX eligibility_evaluations_student_id_drive_id ON public.eligibility_evaluations USING btree (student_id, drive_id);


--
-- Name: eligibility_rule_sets_drive_id_department_id_version_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX eligibility_rule_sets_drive_id_department_id_version_number ON public.eligibility_rule_sets USING btree (drive_id, department_id, version_number);


--
-- Name: eligibility_rule_sets_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX eligibility_rule_sets_status ON public.eligibility_rule_sets USING btree (status);


--
-- Name: external_id_mappings_integration_connection_id_entity_type_enti; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX external_id_mappings_integration_connection_id_entity_type_enti ON public.external_id_mappings USING btree (integration_connection_id, entity_type, entity_id);


--
-- Name: external_id_mappings_integration_connection_id_entity_type_exte; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX external_id_mappings_integration_connection_id_entity_type_exte ON public.external_id_mappings USING btree (integration_connection_id, entity_type, external_id);


--
-- Name: idx_academic_memberships_cohort_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_memberships_cohort_id ON public.student_academic_memberships USING btree (cohort_id);


--
-- Name: idx_academic_memberships_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_memberships_department_id ON public.student_academic_memberships USING btree (department_id);


--
-- Name: idx_academic_memberships_program_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_memberships_program_id ON public.student_academic_memberships USING btree (program_id);


--
-- Name: idx_academic_memberships_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_memberships_student_id ON public.student_academic_memberships USING btree (student_id);


--
-- Name: idx_academic_records_effective_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_records_effective_range ON public.student_academic_records USING btree (effective_from, effective_until);


--
-- Name: idx_academic_records_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_records_student_id ON public.student_academic_records USING btree (student_id);


--
-- Name: idx_academic_records_student_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_records_student_type ON public.student_academic_records USING btree (student_id, record_type);


--
-- Name: idx_academic_records_verified_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_academic_records_verified_by ON public.student_academic_records USING btree (verified_by);


--
-- Name: idx_cohorts_graduation_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cohorts_graduation_year ON public.cohorts USING btree (graduation_year);


--
-- Name: idx_cohorts_program_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cohorts_program_id ON public.cohorts USING btree (program_id);


--
-- Name: idx_programs_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_programs_department_id ON public.programs USING btree (department_id);


--
-- Name: idx_resume_versions_content_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resume_versions_content_hash ON public.resume_versions USING btree (content_hash);


--
-- Name: idx_resume_versions_resume_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resume_versions_resume_id ON public.resume_versions USING btree (resume_id);


--
-- Name: idx_resumes_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resumes_status ON public.resumes USING btree (status);


--
-- Name: idx_resumes_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resumes_student_id ON public.resumes USING btree (student_id);


--
-- Name: idx_student_profiles_cohort_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_profiles_cohort_id ON public.student_profiles USING btree (cohort_id);


--
-- Name: idx_student_profiles_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_profiles_department_id ON public.student_profiles USING btree (department_id);


--
-- Name: idx_student_profiles_placement_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_profiles_placement_status ON public.student_profiles USING btree (placement_status);


--
-- Name: idx_student_profiles_program_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_profiles_program_id ON public.student_profiles USING btree (program_id);


--
-- Name: idx_users_global_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_global_user_id ON public.users USING btree (global_user_id);


--
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: integration_connections_integration_type_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX integration_connections_integration_type_status ON public.integration_connections USING btree (integration_type, status);


--
-- Name: job_applications_drive_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_drive_id ON public.job_applications USING btree (drive_id);


--
-- Name: job_applications_job_opportunity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_job_opportunity_id ON public.job_applications USING btree (job_opportunity_id);


--
-- Name: job_applications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_status ON public.job_applications USING btree (status);


--
-- Name: job_applications_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_student_id ON public.job_applications USING btree (student_id);


--
-- Name: job_applications_student_id_job_opportunity_id_drive_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX job_applications_student_id_job_opportunity_id_drive_id ON public.job_applications USING btree (student_id, job_opportunity_id, drive_id);


--
-- Name: job_description_versions_content_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_description_versions_content_hash ON public.job_description_versions USING btree (content_hash);


--
-- Name: job_description_versions_job_opportunity_id_version_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX job_description_versions_job_opportunity_id_version_number ON public.job_description_versions USING btree (job_opportunity_id, version_number);


--
-- Name: job_offers_company_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_offers_company_id ON public.job_offers USING btree (company_id);


--
-- Name: job_offers_job_opportunity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_offers_job_opportunity_id ON public.job_offers USING btree (job_opportunity_id);


--
-- Name: job_offers_placement_tier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_offers_placement_tier_id ON public.job_offers USING btree (placement_tier_id);


--
-- Name: job_offers_student_id_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_offers_student_id_status ON public.job_offers USING btree (student_id, status);


--
-- Name: job_opportunities_company_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_opportunities_company_id ON public.job_opportunities USING btree (company_id);


--
-- Name: job_opportunities_placement_season_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_opportunities_placement_season_id ON public.job_opportunities USING btree (placement_season_id);


--
-- Name: job_opportunities_source_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_opportunities_source_status ON public.job_opportunities USING btree (source, status);


--
-- Name: knowledge_chunks_knowledge_document_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_chunks_knowledge_document_id ON public.knowledge_chunks USING btree (knowledge_document_id);


--
-- Name: knowledge_chunks_knowledge_document_id_chunk_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX knowledge_chunks_knowledge_document_id_chunk_index ON public.knowledge_chunks USING btree (knowledge_document_id, chunk_index);


--
-- Name: knowledge_documents_cohort_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_documents_cohort_id ON public.knowledge_documents USING btree (cohort_id);


--
-- Name: knowledge_documents_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_documents_department_id ON public.knowledge_documents USING btree (department_id);


--
-- Name: knowledge_documents_program_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_documents_program_id ON public.knowledge_documents USING btree (program_id);


--
-- Name: knowledge_documents_source_type_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_documents_source_type_source_id ON public.knowledge_documents USING btree (source_type, source_id);


--
-- Name: knowledge_documents_source_type_source_id_source_version_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX knowledge_documents_source_type_source_id_source_version_id ON public.knowledge_documents USING btree (source_type, source_id, source_version_id);


--
-- Name: knowledge_documents_visibility_scope_type_visibility_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_documents_visibility_scope_type_visibility_scope_id ON public.knowledge_documents USING btree (visibility_scope_type, visibility_scope_id);


--
-- Name: learning_comments_learning_post_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_comments_learning_post_id_created_at ON public.learning_comments USING btree (learning_post_id, created_at);


--
-- Name: learning_comments_parent_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_comments_parent_comment_id ON public.learning_comments USING btree (parent_comment_id);


--
-- Name: learning_post_skills_learning_post_id_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX learning_post_skills_learning_post_id_skill_id ON public.learning_post_skills USING btree (learning_post_id, skill_id);


--
-- Name: learning_post_skills_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_post_skills_skill_id ON public.learning_post_skills USING btree (skill_id);


--
-- Name: learning_post_tags_learning_post_id_learning_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX learning_post_tags_learning_post_id_learning_tag_id ON public.learning_post_tags USING btree (learning_post_id, learning_tag_id);


--
-- Name: learning_posts_author_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_posts_author_user_id ON public.learning_posts USING btree (author_user_id);


--
-- Name: learning_posts_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_posts_scope_type_scope_id ON public.learning_posts USING btree (scope_type, scope_id);


--
-- Name: learning_posts_status_published_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_posts_status_published_at ON public.learning_posts USING btree (status, published_at);


--
-- Name: learning_reactions_learning_post_id_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX learning_reactions_learning_post_id_user_id ON public.learning_reactions USING btree (learning_post_id, user_id);


--
-- Name: learning_resources_learning_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_resources_learning_post_id ON public.learning_resources USING btree (learning_post_id);


--
-- Name: learning_saves_learning_post_id_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX learning_saves_learning_post_id_user_id ON public.learning_saves USING btree (learning_post_id, user_id);


--
-- Name: learning_saves_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX learning_saves_user_id ON public.learning_saves USING btree (user_id);


--
-- Name: market_skill_snapshots_skill_id_market_captured_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX market_skill_snapshots_skill_id_market_captured_at ON public.market_skill_snapshots USING btree (skill_id, market, captured_at);


--
-- Name: market_skill_snapshots_skill_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX market_skill_snapshots_skill_name ON public.market_skill_snapshots USING btree (skill_name);


--
-- Name: mentorship_availability_slots_alumni_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_availability_slots_alumni_id ON public.mentorship_availability_slots USING btree (alumni_id);


--
-- Name: mentorship_availability_slots_is_booked; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_availability_slots_is_booked ON public.mentorship_availability_slots USING btree (is_booked);


--
-- Name: mentorship_availability_slots_starts_at_ends_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_availability_slots_starts_at_ends_at ON public.mentorship_availability_slots USING btree (starts_at, ends_at);


--
-- Name: mentorship_availability_slots_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_availability_slots_status ON public.mentorship_availability_slots USING btree (status);


--
-- Name: mentorship_bookings_alumni_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_bookings_alumni_id ON public.mentorship_bookings USING btree (alumni_id);


--
-- Name: mentorship_bookings_slot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX mentorship_bookings_slot_id ON public.mentorship_bookings USING btree (slot_id);


--
-- Name: mentorship_bookings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_bookings_status ON public.mentorship_bookings USING btree (status);


--
-- Name: mentorship_bookings_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentorship_bookings_student_id ON public.mentorship_bookings USING btree (student_id);


--
-- Name: message_attachments_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_attachments_message_id ON public.message_attachments USING btree (message_id);


--
-- Name: message_citations_knowledge_chunk_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_citations_knowledge_chunk_id ON public.message_citations USING btree (knowledge_chunk_id);


--
-- Name: message_citations_message_id_rank; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX message_citations_message_id_rank ON public.message_citations USING btree (message_id, rank);


--
-- Name: message_read_receipts_message_id_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX message_read_receipts_message_id_user_id ON public.message_read_receipts USING btree (message_id, user_id);


--
-- Name: message_read_receipts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_read_receipts_user_id ON public.message_read_receipts USING btree (user_id);


--
-- Name: messages_conversation_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_conversation_id_created_at ON public.messages USING btree (conversation_id, created_at);


--
-- Name: messages_parent_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_parent_message_id ON public.messages USING btree (parent_message_id);


--
-- Name: messages_sender_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_sender_user_id ON public.messages USING btree (sender_user_id);


--
-- Name: notification_deliveries_notification_id_channel; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX notification_deliveries_notification_id_channel ON public.notification_deliveries USING btree (notification_id, channel);


--
-- Name: notification_deliveries_status_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notification_deliveries_status_created_at ON public.notification_deliveries USING btree (status, created_at);


--
-- Name: notification_preferences_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notification_preferences_user_id ON public.notification_preferences USING btree (user_id);


--
-- Name: notification_preferences_user_id_channel_category; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX notification_preferences_user_id_channel_category ON public.notification_preferences USING btree (user_id, channel, category);


--
-- Name: notifications_notification_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_notification_type ON public.notifications USING btree (notification_type);


--
-- Name: notifications_user_id_read_at_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_user_id_read_at_created_at ON public.notifications USING btree (user_id, read_at, created_at);


--
-- Name: offer_compensation_components_component_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX offer_compensation_components_component_type ON public.offer_compensation_components USING btree (component_type);


--
-- Name: offer_compensation_components_job_offer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX offer_compensation_components_job_offer_id ON public.offer_compensation_components USING btree (job_offer_id);


--
-- Name: opportunity_submissions_source_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_submissions_source_url ON public.opportunity_submissions USING btree (source_url);


--
-- Name: opportunity_submissions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_submissions_status ON public.opportunity_submissions USING btree (status);


--
-- Name: opportunity_submissions_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_submissions_student_id ON public.opportunity_submissions USING btree (student_id);


--
-- Name: opportunity_verifications_submission_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_verifications_submission_id ON public.opportunity_verifications USING btree (submission_id);


--
-- Name: opportunity_verifications_verification_type_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_verifications_verification_type_status ON public.opportunity_verifications USING btree (verification_type, status);


--
-- Name: permissions_resource_action; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX permissions_resource_action ON public.permissions USING btree (resource, action);


--
-- Name: placement_compliance_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_compliance_events_created_at ON public.placement_compliance_events USING btree (created_at);


--
-- Name: placement_compliance_events_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_compliance_events_event_type ON public.placement_compliance_events USING btree (event_type);


--
-- Name: placement_compliance_events_recorded_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_compliance_events_recorded_by ON public.placement_compliance_events USING btree (recorded_by);


--
-- Name: placement_compliance_events_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_compliance_events_student_id ON public.placement_compliance_events USING btree (student_id);


--
-- Name: placement_drives_job_opportunity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_drives_job_opportunity_id ON public.placement_drives USING btree (job_opportunity_id);


--
-- Name: placement_drives_placement_season_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_drives_placement_season_id ON public.placement_drives USING btree (placement_season_id);


--
-- Name: placement_drives_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_drives_status ON public.placement_drives USING btree (status);


--
-- Name: placement_policies_placement_season_id_name_version_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX placement_policies_placement_season_id_name_version_number ON public.placement_policies USING btree (placement_season_id, name, version_number);


--
-- Name: placement_policies_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_policies_scope_type_scope_id ON public.placement_policies USING btree (scope_type, scope_id);


--
-- Name: placement_policies_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_policies_status ON public.placement_policies USING btree (status);


--
-- Name: placement_policy_rules_policy_id_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_policy_rules_policy_id_priority ON public.placement_policy_rules USING btree (policy_id, priority);


--
-- Name: placement_policy_rules_rule_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_policy_rules_rule_type ON public.placement_policy_rules USING btree (rule_type);


--
-- Name: placement_records_company_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_records_company_id ON public.placement_records USING btree (company_id);


--
-- Name: placement_records_placement_season_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_records_placement_season_id ON public.placement_records USING btree (placement_season_id);


--
-- Name: placement_records_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX placement_records_student_id ON public.placement_records USING btree (student_id);


--
-- Name: placement_tiers_placement_season_id_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX placement_tiers_placement_season_id_code ON public.placement_tiers USING btree (placement_season_id, code);


--
-- Name: placement_tiers_placement_season_id_rank; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX placement_tiers_placement_season_id_rank ON public.placement_tiers USING btree (placement_season_id, rank);


--
-- Name: proctor_events_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX proctor_events_event_type ON public.proctor_events USING btree (event_type);


--
-- Name: proctor_events_proctor_session_id_occurred_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX proctor_events_proctor_session_id_occurred_at ON public.proctor_events USING btree (proctor_session_id, occurred_at);


--
-- Name: proctor_preflights_assessment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX proctor_preflights_assessment_id ON public.proctor_preflights USING btree (assessment_id);


--
-- Name: proctor_preflights_completed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX proctor_preflights_completed_at ON public.proctor_preflights USING btree (completed_at);


--
-- Name: proctor_preflights_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX proctor_preflights_student_id ON public.proctor_preflights USING btree (student_id);


--
-- Name: project_skills_project_id_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX project_skills_project_id_skill_id ON public.project_skills USING btree (project_id, skill_id);


--
-- Name: project_skills_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_skills_skill_id ON public.project_skills USING btree (skill_id);


--
-- Name: recruiter_profiles_company_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX recruiter_profiles_company_id ON public.recruiter_profiles USING btree (company_id);


--
-- Name: recruiter_profiles_verification_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX recruiter_profiles_verification_status ON public.recruiter_profiles USING btree (verification_status);


--
-- Name: recruitment_visits_company_id_visit_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX recruitment_visits_company_id_visit_at ON public.recruitment_visits USING btree (company_id, visit_at);


--
-- Name: referral_posts_alumni_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX referral_posts_alumni_id ON public.referral_posts USING btree (alumni_id);


--
-- Name: referral_posts_status_closes_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX referral_posts_status_closes_at ON public.referral_posts USING btree (status, closes_at);


--
-- Name: referral_requests_referral_post_id_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX referral_requests_referral_post_id_student_id ON public.referral_requests USING btree (referral_post_id, student_id);


--
-- Name: referral_requests_student_id_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX referral_requests_student_id_status ON public.referral_requests USING btree (student_id, status);


--
-- Name: resume_analyses_ai_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resume_analyses_ai_run_id ON public.resume_analyses USING btree (ai_run_id);


--
-- Name: resume_analyses_job_description_version_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resume_analyses_job_description_version_id ON public.resume_analyses USING btree (job_description_version_id);


--
-- Name: resume_analyses_resume_version_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resume_analyses_resume_version_id ON public.resume_analyses USING btree (resume_version_id);


--
-- Name: resume_analyses_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resume_analyses_student_id ON public.resume_analyses USING btree (student_id);


--
-- Name: role_assignments_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX role_assignments_role_id ON public.role_assignments USING btree (role_id);


--
-- Name: role_assignments_scope_type_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX role_assignments_scope_type_scope_id ON public.role_assignments USING btree (scope_type, scope_id);


--
-- Name: role_assignments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX role_assignments_user_id ON public.role_assignments USING btree (user_id);


--
-- Name: role_permissions_role_id_permission_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX role_permissions_role_id_permission_id ON public.role_permissions USING btree (role_id, permission_id);


--
-- Name: saved_items_item_type_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX saved_items_item_type_item_id ON public.saved_items USING btree (item_type, item_id);


--
-- Name: saved_items_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX saved_items_student_id ON public.saved_items USING btree (student_id);


--
-- Name: saved_items_user_id_item_type_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX saved_items_user_id_item_type_item_id ON public.saved_items USING btree (user_id, item_type, item_id);


--
-- Name: skill_evidence_evidence_type_reference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skill_evidence_evidence_type_reference_id ON public.skill_evidence USING btree (evidence_type, reference_id);


--
-- Name: skill_evidence_student_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skill_evidence_student_skill_id ON public.skill_evidence USING btree (student_skill_id);


--
-- Name: skill_gap_analyses_ai_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skill_gap_analyses_ai_run_id ON public.skill_gap_analyses USING btree (ai_run_id);


--
-- Name: skill_gap_analyses_student_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skill_gap_analyses_student_id_created_at ON public.skill_gap_analyses USING btree (student_id, created_at);


--
-- Name: skill_gap_items_skill_gap_analysis_id_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skill_gap_items_skill_gap_analysis_id_priority ON public.skill_gap_items USING btree (skill_gap_analysis_id, priority);


--
-- Name: skill_gap_items_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skill_gap_items_skill_id ON public.skill_gap_items USING btree (skill_id);


--
-- Name: skills_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skills_category ON public.skills USING btree (category);


--
-- Name: skills_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skills_name ON public.skills USING btree (name);


--
-- Name: student_action_items_action_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_action_items_action_type ON public.student_action_items USING btree (action_type);


--
-- Name: student_action_items_deadline; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_action_items_deadline ON public.student_action_items USING btree (deadline);


--
-- Name: student_action_items_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_action_items_priority ON public.student_action_items USING btree (priority);


--
-- Name: student_action_items_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_action_items_status ON public.student_action_items USING btree (status);


--
-- Name: student_action_items_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_action_items_student_id ON public.student_action_items USING btree (student_id);


--
-- Name: student_badges_assessment_attempt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_badges_assessment_attempt_id ON public.student_badges USING btree (assessment_attempt_id);


--
-- Name: student_badges_badge_definition_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_badges_badge_definition_id ON public.student_badges USING btree (badge_definition_id);


--
-- Name: student_badges_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_badges_student_id ON public.student_badges USING btree (student_id);


--
-- Name: student_placement_compliance_compliance_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_placement_compliance_compliance_status ON public.student_placement_compliance USING btree (compliance_status);


--
-- Name: student_placement_compliance_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_placement_compliance_student_id ON public.student_placement_compliance USING btree (student_id);


--
-- Name: student_privacy_preferences_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_privacy_preferences_student_id ON public.student_privacy_preferences USING btree (student_id);


--
-- Name: student_projects_project_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_projects_project_type ON public.student_projects USING btree (project_type);


--
-- Name: student_projects_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_projects_student_id ON public.student_projects USING btree (student_id);


--
-- Name: student_projects_verification_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_projects_verification_status ON public.student_projects USING btree (verification_status);


--
-- Name: student_projects_visibility; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_projects_visibility ON public.student_projects USING btree (visibility);


--
-- Name: student_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_requests_created_at ON public.student_requests USING btree (created_at);


--
-- Name: student_requests_request_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_requests_request_type ON public.student_requests USING btree (request_type);


--
-- Name: student_requests_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_requests_reviewed_by ON public.student_requests USING btree (reviewed_by);


--
-- Name: student_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_requests_status ON public.student_requests USING btree (status);


--
-- Name: student_requests_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_requests_student_id ON public.student_requests USING btree (student_id);


--
-- Name: student_round_results_application_id_drive_round_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_round_results_application_id_drive_round_id ON public.student_round_results USING btree (application_id, drive_round_id);


--
-- Name: student_skills_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_skills_skill_id ON public.student_skills USING btree (skill_id);


--
-- Name: student_skills_student_id_skill_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_skills_student_id_skill_id ON public.student_skills USING btree (student_id, skill_id);


--
-- Name: student_skills_verification_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_skills_verification_status ON public.student_skills USING btree (verification_status);


--
-- Name: submission_reviews_reviewer_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX submission_reviews_reviewer_user_id ON public.submission_reviews USING btree (reviewer_user_id);


--
-- Name: submission_reviews_submission_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX submission_reviews_submission_id ON public.submission_reviews USING btree (submission_id);


--
-- Name: sync_jobs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sync_jobs_created_at ON public.sync_jobs USING btree (created_at);


--
-- Name: sync_jobs_integration_connection_id_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sync_jobs_integration_connection_id_status ON public.sync_jobs USING btree (integration_connection_id, status);


--
-- Name: unique_career_profile_student; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_career_profile_student ON public.student_career_profiles USING btree (student_id);


--
-- Name: unique_cohort_program_admission_year; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_cohort_program_admission_year ON public.cohorts USING btree (program_id, admission_year);


--
-- Name: unique_current_academic_membership_per_student; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_current_academic_membership_per_student ON public.student_academic_memberships USING btree (student_id) WHERE (is_current = true);


--
-- Name: unique_department_institution_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_department_institution_code ON public.departments USING btree (institution_id, code);


--
-- Name: unique_department_settings_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_department_settings_department_id ON public.department_settings USING btree (department_id);


--
-- Name: unique_primary_resume_per_student; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_primary_resume_per_student ON public.resumes USING btree (student_id) WHERE (is_primary = true);


--
-- Name: unique_program_department_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_program_department_code ON public.programs USING btree (department_id, code);


--
-- Name: unique_resume_version_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_resume_version_number ON public.resume_versions USING btree (resume_id, version_number);


--
-- Name: unique_student_cohort_roll_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_student_cohort_roll_number ON public.student_profiles USING btree (cohort_id, roll_number);


--
-- Name: unique_student_profiles_prn_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_student_profiles_prn_number ON public.student_profiles USING btree (prn_number);


--
-- Name: unique_student_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_student_profiles_user_id ON public.student_profiles USING btree (user_id);


--
-- Name: unique_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_users_email ON public.users USING btree (email);


--
-- Name: user_agreements_accepted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_agreements_accepted_at ON public.user_agreements USING btree (accepted_at);


--
-- Name: user_agreements_agreement_type_agreement_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_agreements_agreement_type_agreement_version ON public.user_agreements USING btree (agreement_type, agreement_version);


--
-- Name: user_agreements_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_agreements_student_id ON public.user_agreements USING btree (student_id);


--
-- Name: user_agreements_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_agreements_user_id ON public.user_agreements USING btree (user_id);


--
-- Name: academic_events academic_events_cohort_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_events
    ADD CONSTRAINT academic_events_cohort_id_fkey FOREIGN KEY (cohort_id) REFERENCES public.cohorts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: academic_events academic_events_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_events
    ADD CONSTRAINT academic_events_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: academic_events academic_events_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_events
    ADD CONSTRAINT academic_events_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ai_credit_events ai_credit_events_ai_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_credit_events
    ADD CONSTRAINT ai_credit_events_ai_run_id_fkey FOREIGN KEY (ai_run_id) REFERENCES public.ai_runs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ai_credit_events ai_credit_events_quota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_credit_events
    ADD CONSTRAINT ai_credit_events_quota_id_fkey FOREIGN KEY (quota_id) REFERENCES public.ai_usage_quotas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ai_credit_events ai_credit_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_credit_events
    ADD CONSTRAINT ai_credit_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ai_message_metadata ai_message_metadata_ai_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_metadata
    ADD CONSTRAINT ai_message_metadata_ai_run_id_fkey FOREIGN KEY (ai_run_id) REFERENCES public.ai_runs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ai_message_metadata ai_message_metadata_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_metadata
    ADD CONSTRAINT ai_message_metadata_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumni_connection_requests alumni_connection_requests_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_connection_requests
    ADD CONSTRAINT alumni_connection_requests_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumni_connection_requests alumni_connection_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_connection_requests
    ADD CONSTRAINT alumni_connection_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumni_employments alumni_employments_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_employments
    ADD CONSTRAINT alumni_employments_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumni_profiles alumni_profiles_former_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_profiles
    ADD CONSTRAINT alumni_profiles_former_student_id_fkey FOREIGN KEY (former_student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: alumni_profiles alumni_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_profiles
    ADD CONSTRAINT alumni_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_status_history application_status_history_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_status_history application_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: artifact_attestations artifact_attestations_signer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artifact_attestations
    ADD CONSTRAINT artifact_attestations_signer_user_id_fkey FOREIGN KEY (signer_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessment_assignments assessment_assignments_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_assignments
    ADD CONSTRAINT assessment_assignments_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessment_assignments assessment_assignments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_assignments
    ADD CONSTRAINT assessment_assignments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessment_attempts assessment_attempts_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessment_attempts assessment_attempts_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assessment_assignments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessment_attempts assessment_attempts_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessment_questions assessment_questions_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_questions
    ADD CONSTRAINT assessment_questions_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessment_responses assessment_responses_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_responses
    ADD CONSTRAINT assessment_responses_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.assessment_attempts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessment_responses assessment_responses_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_responses
    ADD CONSTRAINT assessment_responses_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessment_responses assessment_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_responses
    ADD CONSTRAINT assessment_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.assessment_questions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessment_slot_bookings assessment_slot_bookings_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_slot_bookings
    ADD CONSTRAINT assessment_slot_bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.assessment_slots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessment_slot_bookings assessment_slot_bookings_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_slot_bookings
    ADD CONSTRAINT assessment_slot_bookings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessment_slots assessment_slots_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_slots
    ADD CONSTRAINT assessment_slots_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assessments assessments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_logs audit_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_match_results candidate_match_results_match_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_results
    ADD CONSTRAINT candidate_match_results_match_run_id_fkey FOREIGN KEY (match_run_id) REFERENCES public.candidate_match_runs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: candidate_match_results candidate_match_results_resume_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_results
    ADD CONSTRAINT candidate_match_results_resume_version_id_fkey FOREIGN KEY (resume_version_id) REFERENCES public.resume_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_match_results candidate_match_results_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_results
    ADD CONSTRAINT candidate_match_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: candidate_match_runs candidate_match_runs_ai_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_runs
    ADD CONSTRAINT candidate_match_runs_ai_run_id_fkey FOREIGN KEY (ai_run_id) REFERENCES public.ai_runs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: candidate_match_runs candidate_match_runs_candidate_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_runs
    ADD CONSTRAINT candidate_match_runs_candidate_search_id_fkey FOREIGN KEY (candidate_search_id) REFERENCES public.candidate_searches(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_match_runs candidate_match_runs_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_runs
    ADD CONSTRAINT candidate_match_runs_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_match_runs candidate_match_runs_job_description_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_match_runs
    ADD CONSTRAINT candidate_match_runs_job_description_version_id_fkey FOREIGN KEY (job_description_version_id) REFERENCES public.job_description_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_searches candidate_searches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_searches
    ADD CONSTRAINT candidate_searches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_searches candidate_searches_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_searches
    ADD CONSTRAINT candidate_searches_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_searches candidate_searches_recruiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_searches
    ADD CONSTRAINT candidate_searches_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.recruiter_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: candidate_searches candidate_searches_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.candidate_searches
    ADD CONSTRAINT candidate_searches_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cohorts cohorts_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cohorts
    ADD CONSTRAINT cohorts_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: company_contacts company_contacts_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_contacts
    ADD CONSTRAINT company_contacts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversation_contexts conversation_contexts_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_contexts
    ADD CONSTRAINT conversation_contexts_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversations conversations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_activities crm_activities_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_activities crm_activities_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: crm_activities crm_activities_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_activities crm_activities_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES public.crm_pipelines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: crm_pipelines crm_pipelines_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_pipelines
    ADD CONSTRAINT crm_pipelines_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: crm_pipelines crm_pipelines_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crm_pipelines
    ADD CONSTRAINT crm_pipelines_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: data_access_audits data_access_audits_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_access_audits
    ADD CONSTRAINT data_access_audits_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: data_access_audits data_access_audits_resource_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_access_audits
    ADD CONSTRAINT data_access_audits_resource_owner_id_fkey FOREIGN KEY (resource_owner_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: department_settings department_settings_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_settings
    ADD CONSTRAINT department_settings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: departments departments_institution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: drive_departments drive_departments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drive_departments
    ADD CONSTRAINT drive_departments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: drive_departments drive_departments_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drive_departments
    ADD CONSTRAINT drive_departments_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: drive_rounds drive_rounds_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drive_rounds
    ADD CONSTRAINT drive_rounds_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: eligibility_evaluations eligibility_evaluations_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_evaluations
    ADD CONSTRAINT eligibility_evaluations_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: eligibility_evaluations eligibility_evaluations_rule_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_evaluations
    ADD CONSTRAINT eligibility_evaluations_rule_set_id_fkey FOREIGN KEY (rule_set_id) REFERENCES public.eligibility_rule_sets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: eligibility_evaluations eligibility_evaluations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_evaluations
    ADD CONSTRAINT eligibility_evaluations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: eligibility_rule_sets eligibility_rule_sets_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_rule_sets
    ADD CONSTRAINT eligibility_rule_sets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: eligibility_rule_sets eligibility_rule_sets_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_rule_sets
    ADD CONSTRAINT eligibility_rule_sets_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: eligibility_rule_sets eligibility_rule_sets_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eligibility_rule_sets
    ADD CONSTRAINT eligibility_rule_sets_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: external_id_mappings external_id_mappings_integration_connection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_id_mappings
    ADD CONSTRAINT external_id_mappings_integration_connection_id_fkey FOREIGN KEY (integration_connection_id) REFERENCES public.integration_connections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_applications job_applications_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_applications job_applications_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_applications job_applications_resume_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_resume_version_id_fkey FOREIGN KEY (resume_version_id) REFERENCES public.resume_versions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_applications job_applications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_description_versions job_description_versions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_description_versions
    ADD CONSTRAINT job_description_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_description_versions job_description_versions_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_description_versions
    ADD CONSTRAINT job_description_versions_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_offers job_offers_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_offers job_offers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_offers job_offers_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_offers job_offers_placement_tier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_placement_tier_id_fkey FOREIGN KEY (placement_tier_id) REFERENCES public.placement_tiers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_offers job_offers_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_offers
    ADD CONSTRAINT job_offers_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_opportunities job_opportunities_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_opportunities
    ADD CONSTRAINT job_opportunities_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_opportunities job_opportunities_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_opportunities
    ADD CONSTRAINT job_opportunities_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_opportunities job_opportunities_placement_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_opportunities
    ADD CONSTRAINT job_opportunities_placement_season_id_fkey FOREIGN KEY (placement_season_id) REFERENCES public.placement_seasons(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: knowledge_chunks knowledge_chunks_knowledge_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_chunks
    ADD CONSTRAINT knowledge_chunks_knowledge_document_id_fkey FOREIGN KEY (knowledge_document_id) REFERENCES public.knowledge_documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: knowledge_documents knowledge_documents_cohort_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_documents
    ADD CONSTRAINT knowledge_documents_cohort_id_fkey FOREIGN KEY (cohort_id) REFERENCES public.cohorts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: knowledge_documents knowledge_documents_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_documents
    ADD CONSTRAINT knowledge_documents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: knowledge_documents knowledge_documents_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_documents
    ADD CONSTRAINT knowledge_documents_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: knowledge_documents knowledge_documents_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_documents
    ADD CONSTRAINT knowledge_documents_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: learning_comments learning_comments_learning_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_comments
    ADD CONSTRAINT learning_comments_learning_post_id_fkey FOREIGN KEY (learning_post_id) REFERENCES public.learning_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_comments learning_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_comments
    ADD CONSTRAINT learning_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.learning_comments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: learning_comments learning_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_comments
    ADD CONSTRAINT learning_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_post_skills learning_post_skills_learning_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_skills
    ADD CONSTRAINT learning_post_skills_learning_post_id_fkey FOREIGN KEY (learning_post_id) REFERENCES public.learning_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_post_skills learning_post_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_skills
    ADD CONSTRAINT learning_post_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: learning_post_tags learning_post_tags_learning_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_tags
    ADD CONSTRAINT learning_post_tags_learning_post_id_fkey FOREIGN KEY (learning_post_id) REFERENCES public.learning_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_post_tags learning_post_tags_learning_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_post_tags
    ADD CONSTRAINT learning_post_tags_learning_tag_id_fkey FOREIGN KEY (learning_tag_id) REFERENCES public.learning_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_posts learning_posts_author_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_posts
    ADD CONSTRAINT learning_posts_author_user_id_fkey FOREIGN KEY (author_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_reactions learning_reactions_learning_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_reactions
    ADD CONSTRAINT learning_reactions_learning_post_id_fkey FOREIGN KEY (learning_post_id) REFERENCES public.learning_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_reactions learning_reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_reactions
    ADD CONSTRAINT learning_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_resources learning_resources_learning_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_resources
    ADD CONSTRAINT learning_resources_learning_post_id_fkey FOREIGN KEY (learning_post_id) REFERENCES public.learning_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_saves learning_saves_learning_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_saves
    ADD CONSTRAINT learning_saves_learning_post_id_fkey FOREIGN KEY (learning_post_id) REFERENCES public.learning_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: learning_saves learning_saves_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_saves
    ADD CONSTRAINT learning_saves_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: market_skill_snapshots market_skill_snapshots_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_skill_snapshots
    ADD CONSTRAINT market_skill_snapshots_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mentorship_availability_slots mentorship_availability_slots_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentorship_availability_slots
    ADD CONSTRAINT mentorship_availability_slots_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mentorship_bookings mentorship_bookings_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentorship_bookings
    ADD CONSTRAINT mentorship_bookings_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mentorship_bookings mentorship_bookings_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentorship_bookings
    ADD CONSTRAINT mentorship_bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.mentorship_availability_slots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mentorship_bookings mentorship_bookings_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentorship_bookings
    ADD CONSTRAINT mentorship_bookings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_attachments message_attachments_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_citations message_citations_knowledge_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_citations
    ADD CONSTRAINT message_citations_knowledge_chunk_id_fkey FOREIGN KEY (knowledge_chunk_id) REFERENCES public.knowledge_chunks(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: message_citations message_citations_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_citations
    ADD CONSTRAINT message_citations_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_read_receipts message_read_receipts_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_read_receipts
    ADD CONSTRAINT message_read_receipts_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_read_receipts message_read_receipts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_read_receipts
    ADD CONSTRAINT message_read_receipts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_parent_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_parent_message_id_fkey FOREIGN KEY (parent_message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_sender_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_user_id_fkey FOREIGN KEY (sender_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notification_deliveries notification_deliveries_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_deliveries
    ADD CONSTRAINT notification_deliveries_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: offer_compensation_components offer_compensation_components_job_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_compensation_components
    ADD CONSTRAINT offer_compensation_components_job_offer_id_fkey FOREIGN KEY (job_offer_id) REFERENCES public.job_offers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: opportunity_submissions opportunity_submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunity_submissions
    ADD CONSTRAINT opportunity_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: opportunity_verifications opportunity_verifications_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunity_verifications
    ADD CONSTRAINT opportunity_verifications_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.opportunity_submissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: placement_compliance_events placement_compliance_events_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_compliance_events
    ADD CONSTRAINT placement_compliance_events_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_compliance_events placement_compliance_events_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_compliance_events
    ADD CONSTRAINT placement_compliance_events_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_compliance_events placement_compliance_events_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_compliance_events
    ADD CONSTRAINT placement_compliance_events_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: placement_compliance_events placement_compliance_events_reversal_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_compliance_events
    ADD CONSTRAINT placement_compliance_events_reversal_event_id_fkey FOREIGN KEY (reversal_event_id) REFERENCES public.placement_compliance_events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_compliance_events placement_compliance_events_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_compliance_events
    ADD CONSTRAINT placement_compliance_events_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: placement_drives placement_drives_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: placement_drives placement_drives_placement_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_placement_season_id_fkey FOREIGN KEY (placement_season_id) REFERENCES public.placement_seasons(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: placement_drives placement_drives_placement_tier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_placement_tier_id_fkey FOREIGN KEY (placement_tier_id) REFERENCES public.placement_tiers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_policies placement_policies_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_policies
    ADD CONSTRAINT placement_policies_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_policies placement_policies_placement_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_policies
    ADD CONSTRAINT placement_policies_placement_season_id_fkey FOREIGN KEY (placement_season_id) REFERENCES public.placement_seasons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: placement_policy_rules placement_policy_rules_policy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_policy_rules
    ADD CONSTRAINT placement_policy_rules_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.placement_policies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: placement_records placement_records_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_records
    ADD CONSTRAINT placement_records_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: placement_records placement_records_job_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_records
    ADD CONSTRAINT placement_records_job_offer_id_fkey FOREIGN KEY (job_offer_id) REFERENCES public.job_offers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_records placement_records_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_records
    ADD CONSTRAINT placement_records_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: placement_records placement_records_placement_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_records
    ADD CONSTRAINT placement_records_placement_season_id_fkey FOREIGN KEY (placement_season_id) REFERENCES public.placement_seasons(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: placement_records placement_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_records
    ADD CONSTRAINT placement_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: placement_tiers placement_tiers_placement_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_tiers
    ADD CONSTRAINT placement_tiers_placement_season_id_fkey FOREIGN KEY (placement_season_id) REFERENCES public.placement_seasons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: platform_admins platform_admins_global_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_admins
    ADD CONSTRAINT platform_admins_global_user_id_fkey FOREIGN KEY (global_user_id) REFERENCES public.global_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proctor_events proctor_events_proctor_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_events
    ADD CONSTRAINT proctor_events_proctor_session_id_fkey FOREIGN KEY (proctor_session_id) REFERENCES public.proctor_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proctor_preflights proctor_preflights_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_preflights
    ADD CONSTRAINT proctor_preflights_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proctor_preflights proctor_preflights_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_preflights
    ADD CONSTRAINT proctor_preflights_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proctor_sessions proctor_sessions_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proctor_sessions
    ADD CONSTRAINT proctor_sessions_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.assessment_attempts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: programs programs_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_skills project_skills_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_skills
    ADD CONSTRAINT project_skills_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.student_projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_skills project_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_skills
    ADD CONSTRAINT project_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: recruiter_profiles recruiter_profiles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter_profiles
    ADD CONSTRAINT recruiter_profiles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: recruiter_profiles recruiter_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter_profiles
    ADD CONSTRAINT recruiter_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recruiter_profiles recruiter_profiles_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruiter_profiles
    ADD CONSTRAINT recruiter_profiles_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: recruitment_visits recruitment_visits_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recruitment_visits
    ADD CONSTRAINT recruitment_visits_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: referral_posts referral_posts_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_posts
    ADD CONSTRAINT referral_posts_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: referral_posts referral_posts_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_posts
    ADD CONSTRAINT referral_posts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: referral_requests referral_requests_referral_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_requests
    ADD CONSTRAINT referral_requests_referral_post_id_fkey FOREIGN KEY (referral_post_id) REFERENCES public.referral_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: referral_requests referral_requests_resume_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_requests
    ADD CONSTRAINT referral_requests_resume_version_id_fkey FOREIGN KEY (resume_version_id) REFERENCES public.resume_versions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: referral_requests referral_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_requests
    ADD CONSTRAINT referral_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_analyses resume_analyses_ai_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_ai_run_id_fkey FOREIGN KEY (ai_run_id) REFERENCES public.ai_runs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: resume_analyses resume_analyses_job_description_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_job_description_version_id_fkey FOREIGN KEY (job_description_version_id) REFERENCES public.job_description_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: resume_analyses resume_analyses_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: resume_analyses resume_analyses_resume_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_resume_version_id_fkey FOREIGN KEY (resume_version_id) REFERENCES public.resume_versions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: resume_analyses resume_analyses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_versions resume_versions_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_versions
    ADD CONSTRAINT resume_versions_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: resumes resumes_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_assignments role_assignments_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_assignments
    ADD CONSTRAINT role_assignments_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_assignments role_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_assignments
    ADD CONSTRAINT role_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saved_items saved_items_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_items
    ADD CONSTRAINT saved_items_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saved_items saved_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_items
    ADD CONSTRAINT saved_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skill_evidence skill_evidence_student_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evidence
    ADD CONSTRAINT skill_evidence_student_skill_id_fkey FOREIGN KEY (student_skill_id) REFERENCES public.student_skills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skill_evidence skill_evidence_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evidence
    ADD CONSTRAINT skill_evidence_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: skill_gap_analyses skill_gap_analyses_ai_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_analyses
    ADD CONSTRAINT skill_gap_analyses_ai_run_id_fkey FOREIGN KEY (ai_run_id) REFERENCES public.ai_runs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: skill_gap_analyses skill_gap_analyses_job_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_analyses
    ADD CONSTRAINT skill_gap_analyses_job_opportunity_id_fkey FOREIGN KEY (job_opportunity_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: skill_gap_analyses skill_gap_analyses_resume_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_analyses
    ADD CONSTRAINT skill_gap_analyses_resume_version_id_fkey FOREIGN KEY (resume_version_id) REFERENCES public.resume_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: skill_gap_analyses skill_gap_analyses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_analyses
    ADD CONSTRAINT skill_gap_analyses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skill_gap_items skill_gap_items_skill_gap_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_items
    ADD CONSTRAINT skill_gap_items_skill_gap_analysis_id_fkey FOREIGN KEY (skill_gap_analysis_id) REFERENCES public.skill_gap_analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skill_gap_items skill_gap_items_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_gap_items
    ADD CONSTRAINT skill_gap_items_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_academic_memberships student_academic_memberships_cohort_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_memberships
    ADD CONSTRAINT student_academic_memberships_cohort_id_fkey FOREIGN KEY (cohort_id) REFERENCES public.cohorts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_academic_memberships student_academic_memberships_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_memberships
    ADD CONSTRAINT student_academic_memberships_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_academic_memberships student_academic_memberships_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_memberships
    ADD CONSTRAINT student_academic_memberships_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_academic_memberships student_academic_memberships_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_memberships
    ADD CONSTRAINT student_academic_memberships_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_academic_records student_academic_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_records
    ADD CONSTRAINT student_academic_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_academic_records student_academic_records_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_academic_records
    ADD CONSTRAINT student_academic_records_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_action_items student_action_items_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_action_items
    ADD CONSTRAINT student_action_items_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_badges student_badges_assessment_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_badges
    ADD CONSTRAINT student_badges_assessment_attempt_id_fkey FOREIGN KEY (assessment_attempt_id) REFERENCES public.assessment_attempts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_badges student_badges_badge_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_badges
    ADD CONSTRAINT student_badges_badge_definition_id_fkey FOREIGN KEY (badge_definition_id) REFERENCES public.badge_definitions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_badges student_badges_issued_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_badges
    ADD CONSTRAINT student_badges_issued_by_fkey FOREIGN KEY (issued_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_badges student_badges_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_badges
    ADD CONSTRAINT student_badges_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_career_profiles student_career_profiles_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_career_profiles
    ADD CONSTRAINT student_career_profiles_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_placement_compliance student_placement_compliance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_placement_compliance
    ADD CONSTRAINT student_placement_compliance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_privacy_preferences student_privacy_preferences_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_privacy_preferences
    ADD CONSTRAINT student_privacy_preferences_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_profiles student_profiles_cohort_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_cohort_id_fkey FOREIGN KEY (cohort_id) REFERENCES public.cohorts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_profiles student_profiles_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_profiles student_profiles_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_profiles student_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_projects student_projects_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_projects
    ADD CONSTRAINT student_projects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_projects student_projects_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_projects
    ADD CONSTRAINT student_projects_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_requests student_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_requests
    ADD CONSTRAINT student_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_requests student_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_requests
    ADD CONSTRAINT student_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_round_results student_round_results_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_round_results
    ADD CONSTRAINT student_round_results_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_round_results student_round_results_drive_round_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_round_results
    ADD CONSTRAINT student_round_results_drive_round_id_fkey FOREIGN KEY (drive_round_id) REFERENCES public.drive_rounds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_round_results student_round_results_evaluated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_round_results
    ADD CONSTRAINT student_round_results_evaluated_by_fkey FOREIGN KEY (evaluated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_skills student_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_skills student_skills_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: submission_reviews submission_reviews_published_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_reviews
    ADD CONSTRAINT submission_reviews_published_job_id_fkey FOREIGN KEY (published_job_id) REFERENCES public.job_opportunities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: submission_reviews submission_reviews_reviewer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_reviews
    ADD CONSTRAINT submission_reviews_reviewer_user_id_fkey FOREIGN KEY (reviewer_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: submission_reviews submission_reviews_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_reviews
    ADD CONSTRAINT submission_reviews_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.opportunity_submissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: sync_jobs sync_jobs_integration_connection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync_jobs
    ADD CONSTRAINT sync_jobs_integration_connection_id_fkey FOREIGN KEY (integration_connection_id) REFERENCES public.integration_connections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_databases tenant_databases_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_databases
    ADD CONSTRAINT tenant_databases_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_memberships tenant_memberships_global_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_global_user_id_fkey FOREIGN KEY (global_user_id) REFERENCES public.global_users(id) ON DELETE CASCADE;


--
-- Name: tenant_memberships tenant_memberships_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_provisioning_jobs tenant_provisioning_jobs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_provisioning_jobs
    ADD CONSTRAINT tenant_provisioning_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: user_agreements user_agreements_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agreements
    ADD CONSTRAINT user_agreements_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_agreements user_agreements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agreements
    ADD CONSTRAINT user_agreements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

