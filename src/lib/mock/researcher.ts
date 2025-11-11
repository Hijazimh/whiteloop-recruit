export const researcherOverview = {
  kpis: [
    {
      label: "Active Projects",
      value: "3",
      trend: "+1 new this week",
    },
    {
      label: "Sessions Scheduled",
      value: "12",
      trend: "4 waiting to confirm",
    },
    {
      label: "Credits Remaining",
      value: "420",
      trend: "Top up recommended soon",
    },
    {
      label: "Applicants Reviewed",
      value: "58",
      trend: "12 awaiting review",
    },
  ],
  projects: [
    {
      id: "proj-ecom-marketplace",
      title: "E-commerce checkout revamp",
      domain: "eCommerce",
      status: "Recruiting",
      spend: "$1,800",
      matches: 9,
    },
    {
      id: "proj-digital-banking",
      title: "Digital banking onboarding",
      domain: "Fintech",
      status: "Scheduling",
      spend: "$2,450",
      matches: 6,
    },
    {
      id: "proj-health-wellness",
      title: "Wellness app habit loops",
      domain: "Health",
      status: "Draft",
      spend: "$0",
      matches: 0,
    },
  ],
  applicants: [
    {
      id: "app-9812",
      participant: "Lina M.",
      study: "Checkout usability tests",
      score: 86,
      status: "Awaiting review",
      submittedAt: "2 hours ago",
    },
    {
      id: "app-9850",
      participant: "Omar K.",
      study: "Digital banking onboarding",
      score: 72,
      status: "Auto approved",
      submittedAt: "4 hours ago",
    },
    {
      id: "app-9724",
      participant: "Sara A.",
      study: "Checkout usability tests",
      score: 64,
      status: "Needs follow-up",
      submittedAt: "Yesterday",
    },
  ],
  insights: [
    {
      theme: "Cart abandonment drivers",
      why: "Participants hesitate when shipping fees are shown late",
      evidence: "“I only see delivery cost at the last step, so I drop off.”",
      sentiment: "neg",
    },
    {
      theme: "Trust signals",
      why: "The fintech onboarding needs clearer regulator info for GCC users",
      evidence: "“Is this bank licensed in the UAE? I can’t tell easily.”",
      sentiment: "neutral",
    },
  ],
};

export type ResearcherOverview = typeof researcherOverview;

