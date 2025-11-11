import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "participant",
  "researcher",
  "admin",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    role: roleEnum("role").default("participant").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 255 }),
    avatarUrl: text("avatar_url"),
    country: varchar("country", { length: 120 }),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_key").on(table.email),
  })
);

export const participantProfiles = pgTable("participant_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  dob: timestamp("dob", { mode: "date" }),
  languages: text("languages").array(),
  demographics: jsonb("demographics"),
  expertise: text("expertise").array(),
  interests: text("interests").array(),
  kycStatus: varchar("kyc_status", { length: 50 }).default("unverified"),
  payoutAccount: jsonb("payout_account"),
});

export const researcherProfiles = pgTable("researcher_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  company: varchar("company", { length: 255 }),
  website: varchar("website", { length: 255 }),
  planTier: varchar("plan_tier", { length: 50 }).default("starter").notNull(),
  credits: integer("credits").default(0).notNull(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    domain: varchar("domain", { length: 120 }),
    budgetCents: integer("budget_cents").notNull(),
    status: varchar("status", { length: 50 }).default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    researcherIdx: index("projects_researcher_id_idx").on(table.researcherId),
  })
);

export const screeners = pgTable("screeners", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  criteria: jsonb("criteria"),
  questions: jsonb("questions"),
  autoApprove: boolean("auto_approve").default(false).notNull(),
});

export const studies = pgTable(
  "studies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    modality: varchar("modality", { length: 50 }).notNull(),
    durationMin: integer("duration_min").notNull(),
    participantRewardCents: integer("participant_reward_cents").notNull(),
    timezone: varchar("timezone", { length: 120 }).notNull(),
    maxParticipants: integer("max_participants").notNull(),
    screenerId: uuid("screener_id").references(() => screeners.id, {
      onDelete: "set null",
    }),
    status: varchar("status", { length: 50 }).default("recruiting").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    projectIdx: index("studies_project_id_idx").on(table.projectId),
  })
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studyId: uuid("study_id")
      .notNull()
      .references(() => studies.id, { onDelete: "cascade" }),
    participantId: uuid("participant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    answers: jsonb("answers").notNull(),
    score: integer("score").default(0).notNull(),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    studyStatusIdx: index("applications_study_id_status_idx").on(
      table.studyId,
      table.status
    ),
    participantUniqueIdx: uniqueIndex(
      "applications_study_participant_unique"
    ).on(table.studyId, table.participantId),
  })
);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    calcomEventId: varchar("calcom_event_id", { length: 255 }),
    livekitRoom: varchar("livekit_room", { length: 255 }),
    status: varchar("status", { length: 50 })
      .default("awaiting_schedule")
      .notNull(),
  },
  (table) => ({
    applicationUniqueIdx: uniqueIndex("matches_application_id_unique").on(
      table.applicationId
    ),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    recordingUrl: text("recording_url"),
  },
  (table) => ({
    matchUniqueIdx: uniqueIndex("sessions_match_id_unique").on(table.matchId),
  })
);

export const transcripts = pgTable(
  "transcripts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    rawText: text("raw_text").notNull(),
    segments: jsonb("segments"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    sessionUniqueIdx: uniqueIndex("transcripts_session_id_unique").on(
      table.sessionId
    ),
  })
);

export const insightUnits = pgTable(
  "insight_units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studyId: uuid("study_id")
      .notNull()
      .references(() => studies.id, { onDelete: "cascade" }),
    participantId: uuid("participant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    theme: varchar("theme", { length: 255 }).notNull(),
    why: text("why").notNull(),
    evidence: jsonb("evidence"),
    sentiment: varchar("sentiment", { length: 50 }),
    tags: text("tags").array(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    studyIdx: index("insight_units_study_id_idx").on(table.studyId),
  })
);

export const paymentLedgers = pgTable(
  "payment_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: varchar("currency", { length: 10 }).default("USD").notNull(),
    stripeId: varchar("stripe_id", { length: 255 }),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("payment_ledger_user_id_idx").on(table.userId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ParticipantProfile =
  typeof participantProfiles.$inferSelect;
export type ResearcherProfile = typeof researcherProfiles.$inferSelect;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Study = typeof studies.$inferSelect;
export type NewStudy = typeof studies.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Transcript = typeof transcripts.$inferSelect;
export type InsightUnit = typeof insightUnits.$inferSelect;
export type PaymentLedger = typeof paymentLedgers.$inferSelect;

