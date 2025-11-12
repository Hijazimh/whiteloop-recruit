"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { createProjectAction } from "./actions";

interface CreateProjectWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = {
  title: string;
  summary: string;
  researchGoals: string;
  domain: string;
  sensitivityLevel: string;
  
  format: string;
  sessionLength: string;
  totalParticipants: string;
  participantsPerSession: string;
  moderatorType: string;
  
  geographies: string[];
  languages: string[];
  demographics: string;
  behaviors: string;
  
  screenerQuestions: string;
  autoApprove: boolean;
  
  recruitingStart: string;
  recruitingEnd: string;
  sessionStart: string;
  sessionEnd: string;
  timezone: string;
  
  participantReward: string;
  budget: string;
  currency: string;
  
  recordingConsent: boolean;
  dataRetention: string;
  
  visibility: string;
  marketplaceExcerpt: string;
};

const initialFormData: FormData = {
  title: "",
  summary: "",
  researchGoals: "",
  domain: "",
  sensitivityLevel: "low",
  
  format: "interview",
  sessionLength: "45",
  totalParticipants: "12",
  participantsPerSession: "1",
  moderatorType: "researcher",
  
  geographies: [],
  languages: [],
  demographics: "",
  behaviors: "",
  
  screenerQuestions: "",
  autoApprove: false,
  
  recruitingStart: "",
  recruitingEnd: "",
  sessionStart: "",
  sessionEnd: "",
  timezone: "Asia/Dubai",
  
  participantReward: "50",
  budget: "1000",
  currency: "USD",
  
  recordingConsent: true,
  dataRetention: "365",
  
  visibility: "private",
  marketplaceExcerpt: "",
};

const STEPS = [
  { id: "basics", title: "Project Basics", description: "Core information about your research" },
  { id: "methodology", title: "Methodology", description: "How you'll conduct sessions" },
  { id: "audience", title: "Target Audience", description: "Who you want to talk to" },
  { id: "screener", title: "Screener", description: "Questions to qualify participants" },
  { id: "timeline", title: "Timeline", description: "When recruiting and sessions happen" },
  { id: "budget", title: "Budget & Incentives", description: "Participant rewards and funding" },
  { id: "privacy", title: "Privacy & Compliance", description: "Consent and data handling" },
  { id: "review", title: "Review", description: "Confirm and launch" },
];

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Creating..." : children}
    </button>
  );
}

export function CreateProjectWizard({ open, onOpenChange }: CreateProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.summary + "\n\nResearch Goals:\n" + formData.researchGoals);
    formDataObj.append("domain", formData.domain);
    formDataObj.append("budget", formData.budget);
    formDataObj.append("status", "draft");
    
    const result = await createProjectAction(undefined, formDataObj);
    
    if (result.error) {
      setError(result.error);
    } else {
      setFormData(initialFormData);
      setCurrentStep(0);
      onOpenChange(false);
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case "basics":
        return (
          <div className="space-y-4">
            <Field label="Project Title" htmlFor="title" required hint="A clear name for your team to recognize this study">
              <input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="E-commerce checkout usability study"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                required
              />
            </Field>

            <Field label="Short Summary" htmlFor="summary" required hint="1-2 sentences shown to participants (boosts conversion)">
              <textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => updateFormData({ summary: e.target.value })}
                rows={2}
                placeholder="We're exploring how customers complete cross-border payments and where friction occurs."
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                required
              />
            </Field>

            <Field label="Research Goals" htmlFor="researchGoals" required hint="What questions are you trying to answer?">
              <textarea
                id="researchGoals"
                value={formData.researchGoals}
                onChange={(e) => updateFormData({ researchGoals: e.target.value })}
                rows={3}
                placeholder="1. Identify pain points in the checkout flow&#10;2. Understand currency conversion expectations&#10;3. Test new payment method preferences"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Domain" htmlFor="domain" required hint="e.g., Fintech, Health, E-commerce">
                <input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => updateFormData({ domain: e.target.value })}
                  placeholder="Fintech"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  required
                />
              </Field>

              <Field label="Sensitivity Level" htmlFor="sensitivityLevel" hint="Affects consent and PII handling">
                <select
                  id="sensitivityLevel"
                  value={formData.sensitivityLevel}
                  onChange={(e) => updateFormData({ sensitivityLevel: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                >
                  <option value="low">Low - General topics</option>
                  <option value="medium">Medium - Personal preferences</option>
                  <option value="high">High - Sensitive/financial</option>
                </select>
              </Field>
            </div>
          </div>
        );

      case "methodology":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Session Format" htmlFor="format" required>
                <select
                  id="format"
                  value={formData.format}
                  onChange={(e) => updateFormData({ format: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                >
                  <option value="interview">1:1 Interview</option>
                  <option value="usability">Usability Test</option>
                  <option value="focus_group">Focus Group</option>
                  <option value="diary_study">Diary Study</option>
                </select>
              </Field>

              <Field label="Session Length (minutes)" htmlFor="sessionLength" required>
                <input
                  id="sessionLength"
                  type="number"
                  value={formData.sessionLength}
                  onChange={(e) => updateFormData({ sessionLength: e.target.value })}
                  min={15}
                  max={120}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Total Participants" htmlFor="totalParticipants" required hint="How many people total">
                <input
                  id="totalParticipants"
                  type="number"
                  value={formData.totalParticipants}
                  onChange={(e) => updateFormData({ totalParticipants: e.target.value })}
                  min={1}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>

              <Field label="Per Session" htmlFor="participantsPerSession" required hint="1 for interviews, 4-8 for focus groups">
                <input
                  id="participantsPerSession"
                  type="number"
                  value={formData.participantsPerSession}
                  onChange={(e) => updateFormData({ participantsPerSession: e.target.value })}
                  min={1}
                  max={12}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>
            </div>

            <Field label="Moderator Provided By" htmlFor="moderatorType">
              <select
                id="moderatorType"
                value={formData.moderatorType}
                onChange={(e) => updateFormData({ moderatorType: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value="researcher">I'll moderate (included)</option>
                <option value="whiteloop">Whiteloop moderator (add-on)</option>
              </select>
            </Field>
          </div>
        );

      case "audience":
        return (
          <div className="space-y-4">
            <Field label="Geography" htmlFor="geographies" required hint="Which countries/regions?">
              <div className="space-y-2">
                {["UAE", "KSA", "Egypt", "Jordan", "Lebanon"].map((country) => (
                  <label key={country} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.geographies.includes(country)}
                      onChange={(e) => {
                        const newGeos = e.target.checked
                          ? [...formData.geographies, country]
                          : formData.geographies.filter((g) => g !== country);
                        updateFormData({ geographies: newGeos });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Required Languages" htmlFor="languages" hint="What languages must participants speak?">
              <div className="space-y-2">
                {["English", "Arabic", "French"].map((lang) => (
                  <label key={lang} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={(e) => {
                        const newLangs = e.target.checked
                          ? [...formData.languages, lang]
                          : formData.languages.filter((l) => l !== lang);
                        updateFormData({ languages: newLangs });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Demographics" htmlFor="demographics" hint="Age, gender, income, education requirements">
              <textarea
                id="demographics"
                value={formData.demographics}
                onChange={(e) => updateFormData({ demographics: e.target.value })}
                rows={3}
                placeholder="Age: 25-45&#10;Gender: Any&#10;Income: Middle class and above&#10;Education: University degree"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              />
            </Field>

            <Field label="Experience/Behaviors" htmlFor="behaviors" hint="What should participants have done or experienced?">
              <textarea
                id="behaviors"
                value={formData.behaviors}
                onChange={(e) => updateFormData({ behaviors: e.target.value })}
                rows={3}
                placeholder="Made at least 2 online purchases in the last month&#10;Used digital payment apps (Apple Pay, Samsung Pay, etc.)"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              />
            </Field>
          </div>
        );

      case "screener":
        return (
          <div className="space-y-4">
            <Field label="Screener Questions" htmlFor="screenerQuestions" hint="Questions to qualify participants (one per line)">
              <textarea
                id="screenerQuestions"
                value={formData.screenerQuestions}
                onChange={(e) => updateFormData({ screenerQuestions: e.target.value })}
                rows={6}
                placeholder="How many times have you made online purchases in the last 30 days?&#10;Which payment methods do you use regularly?&#10;Have you ever experienced issues with cross-border payments?"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              />
            </Field>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.autoApprove}
                onChange={(e) => updateFormData({ autoApprove: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">
                Auto-approve eligible participants
                <span className="text-muted-foreground ml-1">(saves time, less control)</span>
              </span>
            </label>
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Recruiting Starts" htmlFor="recruitingStart" required>
                <input
                  id="recruitingStart"
                  type="date"
                  value={formData.recruitingStart}
                  onChange={(e) => updateFormData({ recruitingStart: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>

              <Field label="Recruiting Ends" htmlFor="recruitingEnd" required>
                <input
                  id="recruitingEnd"
                  type="date"
                  value={formData.recruitingEnd}
                  onChange={(e) => updateFormData({ recruitingEnd: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Sessions Start" htmlFor="sessionStart" required>
                <input
                  id="sessionStart"
                  type="date"
                  value={formData.sessionStart}
                  onChange={(e) => updateFormData({ sessionStart: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>

              <Field label="Sessions End" htmlFor="sessionEnd" required>
                <input
                  id="sessionEnd"
                  type="date"
                  value={formData.sessionEnd}
                  onChange={(e) => updateFormData({ sessionEnd: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>
            </div>

            <Field label="Timezone" htmlFor="timezone" required>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => updateFormData({ timezone: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (AST)</option>
                <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
              </select>
            </Field>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Participant Reward" htmlFor="participantReward" required hint="Per session, drives conversion">
                <div className="flex items-center gap-2">
                  <input
                    id="participantReward"
                    type="number"
                    value={formData.participantReward}
                    onChange={(e) => updateFormData({ participantReward: e.target.value })}
                    min={0}
                    step={5}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => updateFormData({ currency: e.target.value })}
                    className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="AED">AED</option>
                    <option value="SAR">SAR</option>
                  </select>
                </div>
              </Field>

              <Field label="Total Budget" htmlFor="budget" required hint="Held in escrow when published">
                <input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateFormData({ budget: e.target.value })}
                  min={0}
                  step={50}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </Field>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <p className="font-medium mb-2">Budget Breakdown</p>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>{formData.totalParticipants} participants × {formData.currency} {formData.participantReward}</span>
                  <span>{formData.currency} {parseInt(formData.totalParticipants) * parseInt(formData.participantReward)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee (15%)</span>
                  <span>{formData.currency} {Math.round(parseInt(formData.totalParticipants) * parseInt(formData.participantReward) * 0.15)}</span>
                </div>
                <div className="flex justify-between font-medium text-foreground pt-2 border-t border-border">
                  <span>Recommended budget</span>
                  <span>{formData.currency} {Math.round(parseInt(formData.totalParticipants) * parseInt(formData.participantReward) * 1.15)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.recordingConsent}
                onChange={(e) => updateFormData({ recordingConsent: e.target.checked })}
                className="rounded mt-1"
              />
              <div>
                <span className="text-sm font-medium">Require recording & transcription consent</span>
                <p className="text-xs text-muted-foreground mt-1">Participants must agree before sessions start (recommended for compliance)</p>
              </div>
            </label>

            <Field label="Data Retention" htmlFor="dataRetention" hint="How long to keep session data">
              <select
                id="dataRetention"
                value={formData.dataRetention}
                onChange={(e) => updateFormData({ dataRetention: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year (recommended)</option>
                <option value="730">2 years</option>
              </select>
            </Field>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Project Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium">{formData.title || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-medium">{formData.domain || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{formData.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participants:</span>
                  <span className="font-medium">{formData.totalParticipants} total ({formData.participantsPerSession} per session)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session length:</span>
                  <span className="font-medium">{formData.sessionLength} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participant reward:</span>
                  <span className="font-medium">{formData.currency} {formData.participantReward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total budget:</span>
                  <span className="font-medium">{formData.currency} {formData.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Geographies:</span>
                  <span className="font-medium">{formData.geographies.join(", ") || "None selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages:</span>
                  <span className="font-medium">{formData.languages.join(", ") || "None selected"}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <p className="text-muted-foreground">
                Your project will be saved as a <strong>draft</strong>. You can edit it and publish when ready to start recruiting participants.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{STEPS[currentStep].title}</DialogTitle>
          <DialogDescription>{STEPS[currentStep].description}</DialogDescription>
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </DialogHeader>

        <DialogBody>
          <form id="project-form" onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </DialogBody>

        <DialogFooter>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold transition hover:bg-muted"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Cancel
            </button>
          </div>

          <div>
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Continue
              </button>
            ) : (
              <SubmitButton>Create Project</SubmitButton>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
