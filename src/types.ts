export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  simulated?: boolean;
  language?: string;
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  stage: string;
  attendance: number;
  status: "Live" | "Scheduled" | "Completed";
  currentMinute?: string;
  score: string;
}

export interface Gate {
  name: string;
  location: string;
  queues: string;
  waitTime: string;
  status: string;
  accessTo: string;
}

export interface TransportOption {
  name: string;
  type: "Metro" | "Bus" | "Ride Share" | "Walking";
  status: string;
  frequency: string;
  estTravelTime: string;
  statusLevel: "green" | "yellow" | "orange" | "red";
}

export interface Facility {
  id: string;
  type: "Restroom" | "Food Court" | "Medical" | "Water Station";
  name: string;
  status: string;
  crowd?: string;
  waitTime?: string;
  accessible?: boolean;
  menu?: string;
  capacity?: string;
  contact?: string;
  bottleCount?: number;
}

export interface AccessibilityConfig {
  fontSize: "normal" | "large" | "extra-large";
  highContrast: boolean;
  screenReader: boolean;
  voiceGuided: boolean;
  reducedMotion: boolean;
}

export interface VolunteerTask {
  id: string;
  title: string;
  completed: boolean;
  category: "Lost & Found" | "Medical SOP" | "Crowd Control" | "General";
  assignedTo: string;
}

export interface EmergencyStatus {
  type: "Fire" | "Medical" | "Security" | "Missing Child" | "Evacuation" | null;
  location: string;
  details: string;
  severity: "Critical" | "High" | "Moderate" | null;
  actions: string[];
  checklist: string[];
  announcement: string;
  active: boolean;
}

export interface SustainabilityStats {
  carbonSavedKg: number;
  waterRefills: number;
  greenRoutesTaken: number;
  ecoScore: number;
}
