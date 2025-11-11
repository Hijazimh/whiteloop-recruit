export const participantOverview = {
  profile: {
    name: "Mahmoud H.",
    badges: ["Top Rated", "Early Adopter"],
    completionRate: 96,
    earnings: "$540",
  },
  eligibleStudies: [
    {
      id: "study-ecom-checkout",
      title: "E-commerce checkout interview",
      reward: "$80",
      duration: "45 min on LiveKit",
      tags: ["Shopping", "Mobile"],
    },
    {
      id: "study-fintech-app",
      title: "Fintech budgeting app test",
      reward: "$65",
      duration: "30 min moderated session",
      tags: ["Finance", "Beta feature"],
    },
  ],
  upcomingSessions: [
    {
      id: "match-1203",
      study: "Banking onboarding walkthrough",
      startsAt: "Thu, Nov 13 · 5:30 PM GST",
      link: "#",
    },
  ],
  wallet: {
    pending: "$120",
    available: "$220",
    lastPayout: "Nov 4 · Stripe Express",
  },
};

export type ParticipantOverview = typeof participantOverview;

