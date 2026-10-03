export type Role =
  | "PI"
  | "Coordinator"
  | "Monitor"
  | "Ethics"
  | "Pharmacovigilance"
  | "Admin"
  | "Regulator";

export type StudyStatus =
  | "Recruiting"
  | "Follow-up"
  | "Analysis"
  | "Safety Hold"
  | "Close-out"
  | "Completed";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export interface Site {
  id: string;
  name: string;
  city: string;
  state: string;
  pi: string;
  activated: string;
  target: number;
  screened: number;
  enrolled: number;
  status: "Active" | "Initiating" | "On Hold";
}

export interface Milestone {
  label: string;
  date: string | null;
  status: "done" | "current" | "pending" | "overdue";
}

export interface Deviation {
  id: string;
  studyId: string;
  siteId: string;
  type: string;
  severity: "Minor" | "Major" | "Critical";
  reported: string;
  status: "Open" | "CAPA" | "Closed";
  description: string;
}

export interface DataQuery {
  id: string;
  studyId: string;
  siteId: string;
  field: string;
  raised: string;
  ageDays: number;
  status: "Open" | "Resolved" | "Closed";
}

export interface Study {
  id: string;
  title: string;
  shortTitle: string;
  intervention: string;
  phase: string;
  design: string;
  status: StudyStatus;
  risk: RiskLevel;
  ctriNumber: string;
  ctriStatus: "Registered" | "Submitted" | "Update Due" | "Under Review";
  ctriRegistered: string;
  iecApproval: string;
  iecExpiry: string;
  sponsor: string;
  pi: string;
  indication: string;
  target: number;
  enrolled: number;
  screened: number;
  sites: string[];
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  enrollmentCurve: { month: string; enrolled: number; target: number }[];
  batches: string[];
  prakritiSplit: { prakriti: string; count: number }[];
}

export interface AdverseEvent {
  id: string;
  studyId: string;
  siteId: string;
  participantId: string;
  batchId: string | null;
  term: string;
  meddraPt: string;
  meddraCode: string;
  seriousness: "Serious" | "Non-serious";
  severity: "Mild" | "Moderate" | "Severe";
  onset: string;
  reported: string;
  outcome: "Recovered" | "Recovering" | "Ongoing" | "Resolved with sequelae" | "Fatal";
  whoUmc: "Certain" | "Probable" | "Possible" | "Unlikely" | "Unassessable";
  naranjo: number;
  whodrug: string;
  dechallenge: "Positive" | "Negative" | "Not done";
  concomitant: string[];
}

export interface SaeTimelineStep {
  label: string;
  rule: string;
  dueAt: string;
  doneAt: string | null;
  status: "done" | "due-now" | "pending" | "overdue";
  actor: string;
}

export interface Sae {
  id: string;
  aeId: string;
  studyId: string;
  siteId: string;
  participantId: string;
  batchId: string | null;
  term: string;
  meddraPt: string;
  seriousnessCriteria: string[];
  severity: "Moderate" | "Severe";
  awarenessAt: string;
  initialDueAt: string;
  fullDueAt: string;
  status: "Open" | "Initial Reported" | "Full Reported" | "EC Opinion" | "Closed";
  whoUmc: AdverseEvent["whoUmc"];
  naranjo: number;
  expectedness: "Expected" | "Unexpected";
  compensationEligible: boolean;
  timeline: SaeTimelineStep[];
  narrative: string;
  cioms: boolean;
}

export interface Batch {
  id: string;
  product: string;
  formulation: string;
  manufacturer: string;
  mfgDate: string;
  expDate: string;
  assay: { marker: string; result: string; spec: string; pass: boolean }[];
  heavyMetals: { metal: string; result: number; limit: number; unit: string; pass: boolean }[];
  sitesShipped: { siteId: string; qty: number; shipped: string }[];
  participantsDosed: { participantId: string; studyId: string; siteId: string; firstDose: string }[];
  linkedAes: string[];
  status: "Released" | "Quarantined" | "Under Review" | "Recalled";
  selfGeneratedAlcohol: string | null;
}

export interface AuditEntry {
  seq: number;
  ts: string;
  actor: string;
  role: Role;
  action: string;
  entity: string;
  entityId: string;
  before: string | null;
  after: string | null;
  reason: string | null;
  hash: string;
  prevHash: string;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  studyId: string | null;
  ts: string;
  action: string;
  href: string;
}

export interface ConsentRecord {
  studyId: string;
  version: string;
  language: string;
  active: number;
  reconsentPending: number;
  avConsent: number;
  dpdpPurpose: string;
  status: "Current" | "Amendment Pending" | "Superseded";
}

export interface Persona {
  role: Role;
  name: string;
  designation: string;
  org: string;
  email: string;
  studies: string[];
  permissions: string[];
}

export interface TickerEvent {
  ts: string;
  text: string;
  kind: "enrolment" | "visit" | "safety" | "query" | "regulatory" | "audit";
}
