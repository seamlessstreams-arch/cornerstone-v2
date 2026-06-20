import { useQuery } from "@tanstack/react-query";

type IncidentIntensity = "low" | "medium" | "high" | "severe";
type LinkType = "direct_trigger" | "post_contact_window";
type ContactSafeguardingSignal = "concern" | "attention" | "stable";

export type ContactLinkedBehaviour = {
  id: string;
  date: string;
  title: string;
  direction: string;
  intensity: IncidentIntensity;
  trigger: string;
  antecedent: string;
  outcome: string;
  linkType: LinkType;
};

export type ConcernedContactSession = {
  id: string;
  date: string;
  familyMember: string;
  concerns: string[];
  wasSafe: boolean;
};

export type ChildContactSafeguardingProfile = {
  childId: string;
  childName: string;
  signal: ContactSafeguardingSignal;
  contactLinkedBehaviours: ContactLinkedBehaviour[];
  concernedContactSessions: ConcernedContactSession[];
  daysSinceLastContact: number | null;
  dominantPattern: string | null;
  highestSeverity: IncidentIntensity | null;
};

export type ContactSafeguardingSummary = {
  totalChildrenInScope: number;
  totalContactLinkedIncidents: number;
  childrenWithConcern: number;
  childrenWithAttention: number;
  overallSignal: ContactSafeguardingSignal;
};

export type ContactSafeguardingResponse = {
  profiles: ChildContactSafeguardingProfile[];
  summary: ContactSafeguardingSummary;
};

async function fetchContactSafeguardingIntelligence(): Promise<ContactSafeguardingResponse> {
  const res = await fetch("/api/v1/contact-safeguarding-intelligence");
  if (!res.ok) throw new Error("Failed to fetch contact safeguarding intelligence");
  const json = await res.json();
  return json.data as ContactSafeguardingResponse;
}

export function useContactSafeguardingIntelligence() {
  return useQuery({
    queryKey: ["contact-safeguarding-intelligence"],
    queryFn: fetchContactSafeguardingIntelligence,
    staleTime: 120_000,
  });
}
