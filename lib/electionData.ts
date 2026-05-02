/**
 * Interface representing a stage in the election process.
 */
export interface ElectionStage {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  steps: string[];
  documents: string[];
  tips: string[];
}

/**
 * Predefined stages for the election process.
 */
export const ELECTION_STAGES: ElectionStage[] = [
  {
    id: "unregistered",
    title: "Not Yet Registered",
    icon: "📋",
    color: "bg-red-500",
    steps: [
      "Check eligibility (18+ years, citizen)",
      "Visit election commission website",
      "Fill Form 6 online or offline",
      "Submit with proof of address and age",
      "Track application status"
    ],
    documents: [
      "Aadhaar Card",
      "Passport/Birth Certificate for age proof",
      "Address proof (utility bill/bank statement)"
    ],
    tips: [
      "Register at least 30 days before election",
      "Use mobile app for faster registration",
      "Check voter list after 2-3 weeks"
    ]
  },
  {
    id: "registered",
    title: "Registered Voter",
    icon: "✅",
    color: "bg-yellow-500",
    steps: [
      "Verify your name in voter list",
      "Download/collect Voter ID card",
      "Check your polling booth assignment",
      "Confirm your electoral roll number",
      "Update details if any errors"
    ],
    documents: [
      "Voter ID (EPIC card)",
      "Aadhaar Card as backup ID"
    ],
    tips: [
      "Check voter list at voters.eci.gov.in",
      "Voter ID is not mandatory if you have 12 other approved IDs"
    ]
  },
  {
    id: "pre-election",
    title: "Election Announced",
    icon: "📢",
    color: "bg-blue-500",
    steps: [
      "Note the election date from official sources",
      "Find your polling booth location",
      "Check voting hours (usually 7am-6pm)",
      "Prepare required documents",
      "Plan your travel to booth"
    ],
    documents: [
      "Any one of: Voter ID, Aadhaar, Passport, Driving License, PAN Card, MNREGA Card"
    ],
    tips: [
      "Download Voter Helpline app",
      "Check booth location 2-3 days before",
      "Note booth number from slip"
    ]
  },
  {
    id: "voting-day",
    title: "Voting Day",
    icon: "🗳️",
    color: "bg-green-500",
    steps: [
      "Wake up early, go before 10am to avoid queues",
      "Carry your ID document",
      "Show slip at booth gate",
      "Join correct queue (Male/Female/Senior/PwD)",
      "Press EVM button for your candidate",
      "Get ink mark on finger",
      "Collect VVPAT slip confirmation"
    ],
    documents: [
      "Any approved photo ID",
      "Voter slip if available"
    ],
    tips: [
      "Disabled voters get priority queuing",
      "If name missing, contact 1950 helpline",
      "NOTA is valid vote option"
    ]
  },
  {
    id: "post-voting",
    title: "After Voting",
    icon: "🎉",
    color: "bg-purple-500",
    steps: [
      "Results declared within 24-48 hours",
      "Check results on ECI website",
      "Winner forms government",
      "New government sworn in within weeks",
      "Hold new representatives accountable"
    ],
    documents: [],
    tips: [
      "Track results live at results.eci.gov.in",
      "Your vote is secret — no one can know how you voted"
    ]
  }
];

/**
 * Quick facts about the electoral process.
 */
export const QUICK_FACTS: { question: string; answer: string; icon: string }[] = [
  { question: "What is the voting age?", answer: "18 years and above.", icon: "🎂" },
  { question: "What is NOTA?", answer: "None of the Above. You can reject all candidates.", icon: "🛑" },
  { question: "What is an EVM?", answer: "Electronic Voting Machine used to cast votes.", icon: "💻" },
  { question: "What is VVPAT?", answer: "Voter Verified Paper Audit Trail to verify your vote.", icon: "📄" },
  { question: "What is Form 6?", answer: "Application form for inclusion of name in the electoral roll.", icon: "📝" },
  { question: "What is the 1950 helpline?", answer: "Toll-free national voter helpline number.", icon: "📞" },
  { question: "Types of elections?", answer: "Lok Sabha (National), Vidhan Sabha (State), Panchayats (Local).", icon: "🏢" },
  { question: "Alternatives to Voter ID?", answer: "Aadhaar, PAN, Passport, Driving License, and more.", icon: "💳" }
];

/**
 * Historical milestones in the electoral process.
 */
export const ELECTION_TIMELINE: { year: string; event: string; description: string }[] = [
  { year: "1950", event: "ECI Established", description: "Election Commission of India was established on 25th January." },
  { year: "1951-52", event: "First General Elections", description: "First general elections to the Lok Sabha held over several months." },
  { year: "1982", event: "Introduction of EVMs", description: "Electronic Voting Machines used for the first time in Parur assembly constituency, Kerala." },
  { year: "1989", event: "Voting Age Reduced", description: "Voting age reduced from 21 to 18 years by the 61st Amendment." },
  { year: "1993", event: "EPIC Introduced", description: "Electors Photo Identity Card (EPIC) introduced to prevent electoral fraud." },
  { year: "2013", event: "NOTA Introduced", description: "Supreme Court directed ECI to introduce NOTA button on EVMs." },
  { year: "2014", event: "VVPAT Deployed", description: "VVPAT machines introduced alongside EVMs in general elections." },
  { year: "2019", event: "Highest Turnout", description: "Highest ever voter turnout of 67.4% recorded in general elections." }
];
