import { Match, Gate, TransportOption, Facility, VolunteerTask } from "./types";

export const STADIUM_NAME = "MetLife Stadium (New York New Jersey Stadium)";

export const INITIAL_MATCHES: Match[] = [
  {
    id: "M1",
    teamA: "USA",
    teamB: "Italy",
    date: "2026-07-16",
    time: "19:00",
    stage: "Group Stage - Group A",
    attendance: 81240,
    status: "Live",
    currentMinute: "64",
    score: "2 - 1"
  },
  {
    id: "M2",
    teamA: "Mexico",
    teamB: "Argentina",
    date: "2026-07-19",
    time: "18:00",
    stage: "Round of 32",
    attendance: 0,
    status: "Scheduled",
    score: "v"
  },
  {
    id: "M3",
    teamA: "Winner Match 54",
    teamB: "Winner Match 55",
    date: "2026-07-26",
    time: "20:00",
    stage: "FIFA 2026 Grand Final",
    attendance: 0,
    status: "Scheduled",
    score: "v"
  }
];

export const INITIAL_GATES: { [key: string]: Gate } = {
  "Gate A": {
    name: "Gate A",
    location: "North Corner",
    queues: "Moderate Queue",
    waitTime: "12 mins",
    status: "Active",
    accessTo: "Sections 101-118, 301-315"
  },
  "Gate B": {
    name: "Gate B",
    location: "East Plaza (Lot E Hub)",
    queues: "High Congestion",
    waitTime: "25 mins",
    status: "Active - Slow",
    accessTo: "Sections 119-128, 316-328"
  },
  "Gate C": {
    name: "Gate C",
    location: "South Corner (Metro Station Bypass)",
    queues: "Low Queue",
    waitTime: "5 mins",
    status: "Active - Fast",
    accessTo: "Sections 129-140, 329-338"
  },
  "Gate D": {
    name: "Gate D",
    location: "West Plaza",
    queues: "Normal Flow",
    waitTime: "8 mins",
    status: "Active",
    accessTo: "Sections 141-149, 339-349"
  }
};

export const INITIAL_TRANSPORT: TransportOption[] = [
  {
    name: "Metro Express (To Manhattan/Newark)",
    type: "Metro",
    status: "On Time - Normal Service",
    frequency: "Every 4 mins",
    estTravelTime: "22 mins",
    statusLevel: "green"
  },
  {
    name: "Stadium Eco Shuttle B (Lot E Hub)",
    type: "Bus",
    status: "Slight Delay (Heavy Traffic)",
    frequency: "Every 15 mins",
    estTravelTime: "35 mins",
    statusLevel: "orange"
  },
  {
    name: "FIFA Ride-Share PickUp Zone (Lot G)",
    type: "Ride Share",
    status: "High Demand Surge",
    frequency: "Continuous",
    estTravelTime: "Variable (Surge)",
    statusLevel: "yellow"
  },
  {
    name: "Eco Meadowlands Walking Trail (To Local Transit)",
    type: "Walking",
    status: "Clear & Well Lit",
    frequency: "N/A",
    estTravelTime: "15 mins walk",
    statusLevel: "green"
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: "WC1",
    type: "Restroom",
    name: "Section 114 Premium Restroom",
    status: "Cleaned 5 mins ago",
    crowd: "Low",
    waitTime: "2 mins",
    accessible: true
  },
  {
    id: "WC2",
    type: "Restroom",
    name: "Section 128 Restroom",
    status: "Busy",
    crowd: "High",
    waitTime: "10 mins",
    accessible: true
  },
  {
    id: "WC3",
    type: "Restroom",
    name: "Section 135 Restroom (Family & All Gender)",
    status: "Cleaned 12 mins ago",
    crowd: "Moderate",
    waitTime: "4 mins",
    accessible: true
  },
  {
    id: "FD1",
    type: "Food Court",
    name: "NY Diner (Sec 102)",
    menu: "Stadium Burgers, Fries, Eco Refill Drinks",
    status: "Open",
    crowd: "Moderate",
    waitTime: "6 mins"
  },
  {
    id: "FD2",
    type: "Food Court",
    name: "Taco Express (Sec 121)",
    menu: "World Cup Tacos, Organic Quesadillas, Soda",
    status: "Open",
    crowd: "High",
    waitTime: "14 mins"
  },
  {
    id: "FD3",
    type: "Food Court",
    name: "Healthy Bites (Sec 139)",
    menu: "Salads, Vegan Wraps, Free Water Station Refill",
    status: "Open",
    crowd: "Low",
    waitTime: "1 min"
  },
  {
    id: "MED1",
    type: "Medical",
    name: "First Aid Station A (Sec 110)",
    status: "Fully Staffed (2 Physicians, 4 Nurses)",
    crowd: "Normal",
    capacity: "Available Room",
    contact: "Radio Dispatch Channel 4"
  },
  {
    id: "MED2",
    type: "Medical",
    name: "First Aid Station B (Sec 131)",
    status: "Fully Staffed (1 Physician, 3 Nurses)",
    crowd: "Normal",
    capacity: "Available Room",
    contact: "Radio Dispatch Channel 4"
  },
  {
    id: "ECO1",
    type: "Water Station",
    name: "Meadowlands Eco Refill Hub (Sec 108)",
    status: "Fully Functional",
    bottleCount: 1420
  },
  {
    id: "ECO2",
    type: "Water Station",
    name: "Meadowlands Eco Refill Hub (Sec 132)",
    status: "Fully Functional",
    bottleCount: 2980
  }
];

export const INITIAL_VOLUNTEER_TASKS: VolunteerTask[] = [
  {
    id: "VT1",
    title: "Guide elderly fan to Section 102 wheelchair area",
    completed: true,
    category: "General",
    assignedTo: "Volunteer #14"
  },
  {
    id: "VT2",
    title: "Report spill hazard near Taco Express (Sec 121)",
    completed: false,
    category: "General",
    assignedTo: "Volunteer #09"
  },
  {
    id: "VT3",
    title: "Conduct accessibility checklist for elevator East 4",
    completed: false,
    category: "Crowd Control",
    assignedTo: "Volunteer #22"
  },
  {
    id: "VT4",
    title: "Support Lost Child case registration at Gate D Hub",
    completed: false,
    category: "Lost & Found",
    assignedTo: "Volunteer #05"
  },
  {
    id: "VT5",
    title: "Assist medical staff with spectator evacuation prep (Sec 131)",
    completed: false,
    category: "Medical SOP",
    assignedTo: "Volunteer #12"
  }
];

// Interactive map geometry coordinates representing stadium layers
export interface MapMarker {
  id: string;
  name: string;
  type: "gate" | "seat" | "facility" | "parking" | "metro" | "medical" | "eco";
  x: number;
  y: number;
  waitTime?: string;
  color: string;
}

export const MAP_MARKERS: MapMarker[] = [
  // Gates (perimeter)
  { id: "gate-a", name: "Gate A (North Entrance)", type: "gate", x: 150, y: 30, waitTime: "12 min", color: "#FFC107" },
  { id: "gate-b", name: "Gate B (East Plaza Entrance)", type: "gate", x: 270, y: 150, waitTime: "25 min", color: "#FF5252" },
  { id: "gate-c", name: "Gate C (South Entrance - Metro Bypass)", type: "gate", x: 150, y: 270, waitTime: "5 min", color: "#00E676" },
  { id: "gate-d", name: "Gate D (West Entrance)", type: "gate", x: 30, y: 150, waitTime: "8 min", color: "#00E676" },

  // Seat blocks
  { id: "sec-102", name: "Section 102 Premium Seats", type: "seat", x: 150, y: 90, color: "#00E676" },
  { id: "sec-121", name: "Section 121 Seats", type: "seat", x: 210, y: 150, color: "#FFC107" },
  { id: "sec-135", name: "Section 135 Seats", type: "seat", x: 150, y: 210, color: "#00E676" },
  { id: "sec-144", name: "Section 144 Seats", type: "seat", x: 90, y: 150, color: "#00E676" },

  // Key facilities
  { id: "med-1", name: "First Aid Station A (Sec 110)", type: "medical", x: 110, y: 100, color: "#FF5252" },
  { id: "med-2", name: "First Aid Station B (Sec 131)", type: "medical", x: 190, y: 200, color: "#FF5252" },
  
  { id: "eco-1", name: "Water Refill Hub (Sec 108)", type: "eco", x: 100, y: 80, color: "#00E676" },
  { id: "eco-2", name: "Water Refill Hub (Sec 132)", type: "eco", x: 200, y: 220, color: "#00E676" },

  { id: "metro-hub", name: "Meadowlands Rail Station", type: "metro", x: 150, y: 320, color: "#00E676" },
  { id: "parking-lot", name: "VIP Eco Parking E", type: "parking", x: 320, y: 70, color: "#FFC107" }
];
