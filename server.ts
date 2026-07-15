import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { z } from "zod";
import rateLimit from "express-rate-limit";

dotenv.config();

// Sanitization utility to protect against prompt injection, malicious instructions, and XSS
function sanitizeInput(text: string): string {
  if (typeof text !== "string") return "";
  // 1. Remove dangerous script or HTML tags to prevent XSS
  let sanitized = text.replace(/<[^>]*>/g, "");
  // 2. Redact system instruction override attempts
  sanitized = sanitized.replace(/(ignore previous instructions|system prompt|system instruction|override|you are now)/gi, "[REDACTED_SYSTEM_DIRECTIVE]");
  // 3. Prevent buffer/memory overflow payloads by limiting text size
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + "... (truncated)";
  }
  return sanitized;
}

const app = express();
const PORT = 3000;

// Set up security rate limiter on APIs to protect stadium network
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." }
});

app.use(express.json());
app.use("/api/", apiLimiter);

// Securely initialize Google GenAI SDK
// Accessing GEMINI_API_KEY from environment variables only
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Mock Database for FIFA World Cup 2026 Stadium Info
// Primarily MetLife Stadium, NY/NJ (renamed to New York New Jersey Stadium for FIFA 2026)
// and Azteca Stadium, Mexico City, and BC Place, Vancouver.
const STADIUM_CONTEXT = {
  stadiumName: "MetLife Stadium (New York New Jersey Stadium)",
  capacity: 82500,
  matches: [
    { id: "M1", teamA: "USA", teamB: "Italy", date: "2026-07-16", time: "19:00", stage: "Group Stage", attendance: 81240, status: "Live", currentMinute: "64", score: "2 - 1" },
    { id: "M2", teamA: "Mexico", teamB: "Argentina", date: "2026-07-19", time: "18:00", stage: "Round of 32", attendance: 0, status: "Scheduled", score: "v" },
    { id: "M3", teamA: "Winner R1", teamB: "Winner R2", date: "2026-07-26", time: "20:00", stage: "Final Match", attendance: 0, status: "Scheduled", score: "v" }
  ],
  gates: {
    "Gate A": { location: "North Corner", queues: "Moderate", waitTime: "12 mins", status: "Active", accessTo: "Sections 101-118, 301-315" },
    "Gate B": { location: "East Plaza", queues: "High Congestion", waitTime: "25 mins", status: "Active - Slow", accessTo: "Sections 119-128, 316-328" },
    "Gate C": { location: "South Corner (Metro Express Entrance)", queues: "Low", waitTime: "5 mins", status: "Active - Fast", accessTo: "Sections 129-140, 329-338" },
    "Gate D": { location: "West Plaza", queues: "Normal", waitTime: "8 mins", status: "Active", accessTo: "Sections 141-149, 339-349" }
  },
  transport: {
    "Metro Link (Strait to NYC)": { type: "Metro", status: "On Time", frequency: "Every 4 mins", estTravelTime: "22 mins", statusLevel: "green" },
    "Bus Shuttle B (Lot E Hub)": { type: "Bus", status: "Delayed", frequency: "Every 15 mins", estTravelTime: "35 mins", statusLevel: "orange" },
    "Taxi & Ride Share Hub (Lot G)": { type: "Ride Share", status: "High Demand", frequency: "Continuous", estTravelTime: "Variable", statusLevel: "yellow" },
    "Eco Walking Path (Meadowlands Trail)": { type: "Walking", status: "Clear", frequency: "N/A", estTravelTime: "15 mins to Local Station", statusLevel: "green" }
  },
  facilities: [
    { id: "WC1", type: "Restroom", name: "Section 114 Restroom", status: "Clean", crowd: "Low", waitTime: "2 mins", accessible: true },
    { id: "WC2", type: "Restroom", name: "Section 128 Restroom", status: "Busy", crowd: "High", waitTime: "10 mins", accessible: true },
    { id: "WC3", type: "Restroom", name: "Section 135 Restroom (Gender Neutral)", status: "Clean", crowd: "Moderate", waitTime: "4 mins", accessible: true },
    { id: "FD1", type: "Food Court", name: "NY Diner (Sec 102)", menu: "Burgers, Fries, Reusable Drinks", status: "Open", crowd: "Moderate", waitTime: "6 mins" },
    { id: "FD2", type: "Food Court", name: "Taco Express (Sec 121)", menu: "Tacos, Quesadillas, Soda", status: "Open", crowd: "High", waitTime: "14 mins" },
    { id: "FD3", type: "Food Court", name: "Healthy Bites (Sec 139)", menu: "Salads, Vegan Wraps, Eco-Water Station", status: "Open", crowd: "Low", waitTime: "1 min" },
    { id: "MED1", type: "Medical", name: "First Aid Station A (Sec 110)", status: "Staffed", capacity: "Available", contact: "Gate D Radio" },
    { id: "MED2", type: "Medical", name: "First Aid Station B (Sec 131)", status: "Staffed", capacity: "Available", contact: "Gate B Radio" },
    { id: "ECO1", type: "Water Station", name: "Reusable Bottle Refill Hub (Sec 108)", status: "Functional", bottleCount: 1420 },
    { id: "ECO2", type: "Water Station", name: "Reusable Bottle Refill Hub (Sec 132)", status: "Functional", bottleCount: 2980 }
  ]
};

// Zod schemas for input validation and strict type guarantees
const ChatSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.string().max(20),
    content: z.string().max(2000)
  })).optional()
});

const TranslateSchema = z.object({
  text: z.string().min(1).max(1000),
  targetLanguage: z.string().min(1).max(50)
});

const SustainabilitySchema = z.object({
  startSection: z.string().min(1).max(100),
  endSection: z.string().min(1).max(100)
});

const EmergencySchema = z.object({
  type: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  details: z.string().max(1000).optional().nullable()
});

const VolunteerSchema = z.object({
  category: z.string().min(1).max(100).optional(),
  query: z.string().min(1).max(1000).optional()
});

// 1. AI Stadium Assistant Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const parsedInput = ChatSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({ error: "Invalid request payload format", details: parsedInput.error.issues });
    }

    const { message, history } = parsedInput.data;
    if (!apiKey) {
      return res.status(200).json({
        text: "⚠️ **Gemini API Key is missing!** Please configure the `GEMINI_API_KEY` secret in your environment settings (Settings > Secrets) to enable AI assistance. Currently showing simulated responses.",
        simulated: true
      });
    }

    const systemPrompt = `You are "StadiumMind AI", the official intelligent operational and fan experience assistant for the FIFA World Cup 2026.
You are embedded inside a dashboard that serves fans, venue organizers, volunteers, and security teams at the New York New Jersey Stadium (MetLife Stadium).
Here is the live stadium data and context:
${JSON.stringify(STADIUM_CONTEXT, null, 2)}

Your tone is professional, welcoming, highly clear, and supportive.
When answering:
1. Always base seating, gate, restroom, food, and transport routes on the provided STADIUM_CONTEXT where possible.
2. If a user asks about an emergency (e.g. "medical emergency", "fire", "lost child", "evacuate"), provide immediate, bolded, step-by-step guidance, recommend the nearest Gate or First Aid Station, and urge contacting emergency personnel.
3. Keep responses structured with markdown, bullet points, or lists for high readability on mobile screens during chaotic match environments.
4. If a question is in another language, translate your understanding and reply in that language or offer clear support.
5. Emphasize sustainability (e.g., recommend reusable bottle refill hubs at Sec 108 or 132, waste segregation, green routes).
6. Give helpful, realistic responses without mentioning that you are reading from a raw JSON configuration. Present yourself as a fully integrated stadium brain.
7. For every operational action, emergency instruction, or SOP checklist recommendation you formulate, you MUST strictly include these three dimensions in the response: **Who** (the designated responder, steward, or agency), **Why** (the rationale, urgency context, or standard SOP rule), and **Impact** (the safety metric or strategic outcome achieved). Ensure this context is clearly visible to the user.`;

    const chatSessionContents = [];
    
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          content: sanitizeInput(h.content)
        }))
      : [];
    
    // Add history in the format required by SDK (or plain string aggregation if easier)
    // To ensure perfect SDK compatibility, we can structure it or pass as aggregated string.
    // The gemini-3.5-flash handles rich conversational text natively. Let's build a single aggregated prompt.
    let fullPrompt = "";
    if (sanitizedHistory && sanitizedHistory.length > 0) {
      fullPrompt += "Conversation History:\n";
      sanitizedHistory.forEach((h: any) => {
        const speaker = h.role === "user" ? "User" : "StadiumMind AI";
        fullPrompt += `${speaker}: ${h.content}\n`;
      });
    }
    fullPrompt += `User: ${sanitizedMessage}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({
      text: response.text || "Sorry, I am unable to process your request at this moment.",
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message
    });
  }
});

// 2. Multilingual AI Translator Endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const parsedInput = TranslateSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({ error: "Invalid translation query payload", details: parsedInput.error.issues });
    }

    const { text, targetLanguage } = parsedInput.data;
    const sanitizedText = sanitizeInput(text);
    const sanitizedLang = sanitizeInput(targetLanguage);

    if (!apiKey) {
      return res.json({
        translatedText: `[Simulated Translation to ${sanitizedLang}]: ${sanitizedText}`,
        detectedLanguage: "English (Simulated)"
      });
    }

    const prompt = `Translate the following stadium announcement or support text into ${sanitizedLang}. 
Detect the source language automatically. Return a JSON response with 'translatedText' and 'detectedLanguage'.
Source text: "${sanitizedText}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            translatedText: { type: "STRING" },
            detectedLanguage: { type: "STRING" }
          },
          required: ["translatedText", "detectedLanguage"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed", details: error.message });
  }
});

// 3. Sustainability AI Route Recommendation
app.post("/api/sustainability", async (req, res) => {
  try {
    const parsedInput = SustainabilitySchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({ error: "Invalid sustainability routing points", details: parsedInput.error.issues });
    }

    const { startSection, endSection } = parsedInput.data;
    const sanitizedStart = sanitizeInput(startSection);
    const sanitizedEnd = sanitizeInput(endSection);

    if (!apiKey) {
      return res.json({
        ecoScore: 92,
        reusableStationsPassed: ["Sec 108 Reusable Bottle Refill Hub", "Eco Bin Segregation Zone East"],
        carbonSavingKg: 0.45,
        tip: "Great work! You bypassed 2 bottled soda stalls. Use the Sec 108 Eco Hub to refill your bottle for free."
      });
    }

    const prompt = `Recommend a sustainable transit route inside MetLife Stadium from Section ${sanitizedStart} to Section ${sanitizedEnd}. 
Highlight eco-friendly milestones (like reusable water bottle refill hubs, plastic recycling bins, and low-energy lighting corridors).
Estimate carbon footprint savings in kilograms (e.g. 0.2 to 0.8 kg) compared to buying single-use plastics.
Return JSON with 'ecoScore' (number 1-100), 'reusableStationsPassed' (array of strings), 'carbonSavingKg' (number), and 'tip' (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            ecoScore: { type: "INTEGER" },
            reusableStationsPassed: { type: "ARRAY", items: { type: "STRING" } },
            carbonSavingKg: { type: "NUMBER" },
            tip: { type: "STRING" }
          },
          required: ["ecoScore", "reusableStationsPassed", "carbonSavingKg", "tip"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Sustainability calculations failed:", error);
    res.status(500).json({ error: "Sustainability check failed", details: error.message });
  }
});

// 4. Emergency Response AI Checklist
app.post("/api/emergency", async (req, res) => {
  try {
    const parsedInput = EmergencySchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({ error: "Invalid emergency incident parameters", details: parsedInput.error.issues });
    }

    const { type, location, details } = parsedInput.data;
    const sanitizedType = sanitizeInput(type);
    const sanitizedLocation = sanitizeInput(location);
    const sanitizedDetails = sanitizeInput(details || "");

    if (!apiKey) {
      return res.json({
        severity: "Critical",
        immediateActions: [
          `Dispatch stadium medical responders (Who) directly to Section ${sanitizedLocation} to deliver triage care (Why) and ensure immediate patient safety (Impact).`,
          `Notify Section 110 First Aid Post A team (Who) for immediate stretcher readiness (Why) to fast-track emergency evacuation (Impact).`,
          "Direct elevator operators (Who) to secure elevator West-3 for medical extraction egress (Why) to minimize transit bottlenecking (Impact)."
        ],
        checklist: [
          "On-site Lead Responder (Who) checks patient breathing and vital signs (Why) to record critical status baseline (Impact).",
          "Stadium security stewards (Who) clear the local corridor crowd (Why) to prevent panic and ease responder movement (Impact).",
          "Crisis communications lead (Who) updates dispatcher on Radio Channel 4 (Why) to coordinate logistical backup if needed (Impact)."
        ],
        announcement: `Medical support is en route to Section ${sanitizedLocation}. Please make way for first responders.`
      });
    }

    const prompt = `You are a crisis coordinator for the FIFA World Cup 2026. 
Formulate an immediate operational checklist for a ${sanitizedType} emergency reported at location ${sanitizedLocation}.
Details provided: "${sanitizedDetails}".
Analyze stadium layout (First Aid Station A at Section 110, First Aid Station B at Section 131).

For every checklist item in 'immediateActions' and 'checklist', you MUST strictly include the following dimensions clearly within the text description:
- **Who**: Specify the designated responder, agency, or stadium operator responsible for the task.
- **Why**: State the operational rationale or safety policy behind the action.
- **Impact**: Detail the desired safety or operational outcome/metric achieved.

Return a JSON structure with 'severity' ('Critical', 'High', 'Moderate'), 'immediateActions' (array of strings), 'checklist' (array of strings), and 'announcement' (string of a public announcement message suitable to broadcast).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            severity: { type: "STRING" },
            immediateActions: { type: "ARRAY", items: { type: "STRING" } },
            checklist: { type: "ARRAY", items: { type: "STRING" } },
            announcement: { type: "STRING" }
          },
          required: ["severity", "immediateActions", "checklist", "announcement"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Emergency AI Checklist error:", error);
    res.status(500).json({ error: "Emergency generator failed", details: error.message });
  }
});

// 5. Volunteer AI Task Guidance & SOPs
app.post("/api/volunteer", async (req, res) => {
  try {
    const parsedInput = VolunteerSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({ error: "Invalid volunteer task query", details: parsedInput.error.issues });
    }

    const { category, query } = parsedInput.data;
    const sanitizedCategory = sanitizeInput(category || "General");
    const sanitizedQuery = sanitizeInput(query || "What to do with lost and found items?");

    if (!apiKey) {
      return res.json({
        answer: "Provide standard friendly guidance. Escort lost fans to the nearest Info Desk (located behind Sec 118 & 136). For lost items, direct them to file a ticket or hand it over to Gate D Lost & Found Hub.",
        checklist: [
          "Confirm fan ticket location",
          "Advise using the Gate C escalators for fast accessibility egress",
          "Distribute hydration water cups in warm zones"
        ]
      });
    }

    const prompt = `You are the Volunteer Supervisor AI for FIFA 2026. 
Provide a clear operational answer and standard operating procedure for a volunteer asking about category "${sanitizedCategory}" and query: "${sanitizedQuery}".
Return a JSON object with 'answer' (string) and 'checklist' (array of strings).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            answer: { type: "STRING" },
            checklist: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["answer", "checklist"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Volunteer AI failed:", error);
    res.status(500).json({ error: "Volunteer SOP failed", details: error.message });
  }
});

// 6. Organizer Command Center Operational Insights
app.get("/api/organizer/insights", async (req, res) => {
  try {
    if (!apiKey) {
      return res.json({
        crowdTrend: "Crowd ingress peaking. Rapid flow detected at Gate C (Metro Hub). Gate B experiences high queuing delay.",
        alertLevel: "Yellow",
        recommendations: [
          "Reroute metro arrivals to use Gate C bypass lane.",
          "Deploy 12 additional mobile volunteers to East Plaza (Gate B) to pre-scan mobile QR tickets.",
          "Trigger Eco-Friendly Transit push notification for the upcoming post-match egress."
        ],
        greenOptimization: "Directing 15% more walking traffic via Meadowlands Trail reduces carbon footprint by an estimated 112kg CO2 equivalent."
      });
    }

    const prompt = `You are the Lead FIFA Crowd Strategist & Stadium AI Optimizer.
Generate active real-time operational insights based on current live simulation parameters of MetLife Stadium.
Current live stats: Attendance 81,240 (98% capacity), Gate B bottleneck (25 min wait time), Metro running at full capacity (4 min freq), Group Stage USA vs Italy in progress (Minute 64, Score 2-1).
Return a JSON object with:
- 'crowdTrend' (string: analysis of current entry/exit flow)
- 'alertLevel' (string: 'Green', 'Yellow', 'Red')
- 'recommendations' (array of strings: direct actionable instructions)
- 'greenOptimization' (string: how sustainability scores can be optimized right now)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            crowdTrend: { type: "STRING" },
            alertLevel: { type: "STRING" },
            recommendations: { type: "ARRAY", items: { type: "STRING" } },
            greenOptimization: { type: "STRING" }
          },
          required: ["crowdTrend", "alertLevel", "recommendations", "greenOptimization"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Organizer Insights failed:", error);
    res.status(500).json({ error: "Insights failed", details: error.message });
  }
});

// Serve Vite-managed React App in dev & production
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[StadiumMind AI Server] Running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Server boot failure:", err);
});
