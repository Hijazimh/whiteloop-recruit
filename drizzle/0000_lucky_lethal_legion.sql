CREATE TYPE "public"."role" AS ENUM('participant', 'researcher', 'admin');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"study_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insight_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"study_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"theme" varchar(255) NOT NULL,
	"why" text NOT NULL,
	"evidence" jsonb,
	"sentiment" varchar(50),
	"tags" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone,
	"calcom_event_id" varchar(255),
	"livekit_room" varchar(255),
	"status" varchar(50) DEFAULT 'awaiting_schedule' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participant_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"dob" timestamp,
	"languages" text[],
	"demographics" jsonb,
	"expertise" text[],
	"interests" text[],
	"kyc_status" varchar(50) DEFAULT 'unverified',
	"payout_account" jsonb
);
--> statement-breakpoint
CREATE TABLE "payment_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"stripe_id" varchar(255),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"researcher_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"domain" varchar(120),
	"budget_cents" integer NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researcher_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"company" varchar(255),
	"website" varchar(255),
	"plan_tier" varchar(50) DEFAULT 'starter' NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screeners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"criteria" jsonb,
	"questions" jsonb,
	"auto_approve" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"recording_url" text
);
--> statement-breakpoint
CREATE TABLE "studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"modality" varchar(50) NOT NULL,
	"duration_min" integer NOT NULL,
	"participant_reward_cents" integer NOT NULL,
	"timezone" varchar(120) NOT NULL,
	"max_participants" integer NOT NULL,
	"screener_id" uuid,
	"status" varchar(50) DEFAULT 'recruiting' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transcripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"raw_text" text NOT NULL,
	"segments" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'participant' NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"avatar_url" text,
	"country" varchar(120)
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_study_id_studies_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_participant_id_users_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_units" ADD CONSTRAINT "insight_units_study_id_studies_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_units" ADD CONSTRAINT "insight_units_participant_id_users_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_units" ADD CONSTRAINT "insight_units_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant_profiles" ADD CONSTRAINT "participant_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_ledger" ADD CONSTRAINT "payment_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_researcher_id_users_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_profiles" ADD CONSTRAINT "researcher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screeners" ADD CONSTRAINT "screeners_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studies" ADD CONSTRAINT "studies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studies" ADD CONSTRAINT "studies_screener_id_screeners_id_fk" FOREIGN KEY ("screener_id") REFERENCES "public"."screeners"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transcripts" ADD CONSTRAINT "transcripts_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_study_id_status_idx" ON "applications" USING btree ("study_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "applications_study_participant_unique" ON "applications" USING btree ("study_id","participant_id");--> statement-breakpoint
CREATE INDEX "insight_units_study_id_idx" ON "insight_units" USING btree ("study_id");--> statement-breakpoint
CREATE UNIQUE INDEX "matches_application_id_unique" ON "matches" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "payment_ledger_user_id_idx" ON "payment_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_researcher_id_idx" ON "projects" USING btree ("researcher_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_match_id_unique" ON "sessions" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "studies_project_id_idx" ON "studies" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "transcripts_session_id_unique" ON "transcripts" USING btree ("session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");