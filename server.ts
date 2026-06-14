import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

interface RegistrationData {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  participation: "yes" | "no" | "maybe";
  hasFamily: "yes" | "no";
  familyCount: number;
  emergencyPhone: string;
  notes: string;
  agreement: boolean;
  paidAlready?: "yes" | "no";
  paymentMethod?: string;
  paidAmount?: string;
  transactionId?: string;
  adminPaymentStatus?: string;
}

interface DB {
  passwordHash: string;
  appsScriptUrl: string;
  registrations: RegistrationData[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Define basic SHA-256 hasher
function hashPassword(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

// Ensure database file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultPasswordHash = hashPassword("marketingtour2026");

const defaultMockData: RegistrationData[] = [
  {
    id: "mock_1",
    timestamp: "১৪/৬/২০২৬, সকাল ১০:১৮:৩০",
    name: "জি এম রবিউল হাসান",
    phone: "01964334759",
    participation: "yes",
    hasFamily: "yes",
    familyCount: 1,
    emergencyPhone: "01712345678",
    notes: "খুলনা স্টেশন থেকে সরাসরি যাত্রা করবো এবং ফিরবো। খাবারের ঝাল কম হলে ভালো হয়।",
    agreement: true,
    paidAlready: "no",
    adminPaymentStatus: "Unpaid"
  },
  {
    id: "mock_2",
    timestamp: "১৪/৬/২০২৬, সকাল ১০:২৫:৪৫",
    name: "পাপড়ি চক্রবর্তী",
    phone: "01911122233",
    participation: "yes",
    hasFamily: "no",
    familyCount: 0,
    emergencyPhone: "01888777666",
    notes: "আমাদের মার্কেটিং বিভাগের (২য় বর্ষ) সকলের স্বতঃস্ফূর্ত অংশগ্রহণ কামনা করছি!",
    agreement: true,
    paidAlready: "no",
    adminPaymentStatus: "Unpaid"
  }
];

function loadDB(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content);
      // Ensure expected fields exist
      return {
        passwordHash: parsed.passwordHash || defaultPasswordHash,
        appsScriptUrl: parsed.appsScriptUrl || "",
        registrations: Array.isArray(parsed.registrations) ? parsed.registrations : defaultMockData
      };
    }
  } catch (error) {
    console.error("Error loading database file, falling back to default:", error);
  }
  
  const initialDB: DB = {
    passwordHash: defaultPasswordHash,
    appsScriptUrl: "",
    registrations: defaultMockData
  };
  saveDB(initialDB);
  return initialDB;
}

function saveDB(data: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database file:", error);
  }
}

// In-memory sessions
const activeServerSessions = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper local db handle
  let db = loadDB();

  // Authentication Middleware
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "অননুমোদিত প্রবেশ! দয়া করে ড্যাশবোর্ডে আবার লগইন করুন।" });
    }
    const token = authHeader.substring(7);
    if (!activeServerSessions.has(token)) {
      return res.status(401).json({ error: "আপনার সেশনটি শেষ হয়ে গেছে। দয়া করে ড্যাশবোর্ডে পুনরায় লগইন করুন।" });
    }
    next();
  };

  // API Route - Server Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // API Route - Public Config
  app.get("/api/public-config", (req, res) => {
    res.json({
      appsScriptUrl: db.appsScriptUrl
    });
  });

  // API Route - Server Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "পাসওয়ার্ড আবশ্যক!" });
    }

    const hashedInput = hashPassword(password);
    if (hashedInput === db.passwordHash) {
      // Create session key
      const token = "token_" + crypto.randomBytes(32).toString("hex");
      activeServerSessions.add(token);
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ error: "ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড টাইপ করুন।" });
    }
  });

  // API Route - Admin Logout
  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      activeServerSessions.delete(token);
    }
    res.json({ success: true });
  });

  // API Route - Get Apps Script Link & Core Configurations
  app.get("/api/admin/config", requireAdmin, (req, res) => {
    res.json({
      appsScriptUrl: db.appsScriptUrl
    });
  });

  // API Route - Save Apps Script Link & Core Configurations
  app.post("/api/admin/config", requireAdmin, (req, res) => {
    const { appsScriptUrl } = req.body;
    db.appsScriptUrl = appsScriptUrl || "";
    saveDB(db);
    res.json({ success: true, appsScriptUrl: db.appsScriptUrl });
  });

  // API Route - Change Admin Password
  app.post("/api/admin/change-password", requireAdmin, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "পুরাতন ও নতুন উভয় পাসওয়ার্ড আবশ্যক!" });
    }

    if (hashPassword(oldPassword) !== db.passwordHash) {
      return res.status(400).json({ error: "পুরাতন পাসওয়ার্ডটি সঠিক নয়!" });
    }

    db.passwordHash = hashPassword(newPassword);
    saveDB(db);
    res.json({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!" });
  });

  // API Route - Get All Registrations
  app.get("/api/registrations", requireAdmin, (req, res) => {
    res.json(db.registrations);
  });

  // API Route - Add a Public Registration (No Authentication Required)
  app.post("/api/registrations/submit", async (req, res) => {
    const registration: RegistrationData = req.body;
    if (!registration || !registration.id || !registration.name || !registration.phone) {
      return res.status(400).json({ error: "অসম্পূর্ণ রেজিস্ট্রেশন ডেটা!" });
    }

    // Append to server database
    db.registrations.unshift(registration);
    saveDB(db);

    // If Google Apps Script Web App URL is active, sync it on the server-side to avoid client CORS failures!
    if (db.appsScriptUrl) {
      try {
        const urlParams = new URLSearchParams();
        urlParams.append("timestamp", registration.timestamp);
        urlParams.append("name", registration.name);
        urlParams.append("phone", registration.phone);
        urlParams.append("participation", registration.participation === "yes" ? "হ্যাঁ" : registration.participation === "no" ? "না" : "এখনও নিশ্চিত নই");
        urlParams.append("hasFamily", registration.hasFamily === "yes" ? "হ্যাঁ" : "না");
        urlParams.append("familyCount", String(registration.familyCount));
        urlParams.append("emergencyPhone", registration.emergencyPhone);
        urlParams.append("notes", registration.notes);
        urlParams.append("paidAlready", registration.paidAlready === "yes" ? "হ্যাঁ" : "না");
        urlParams.append("paymentMethod", registration.paymentMethod || "");
        urlParams.append("paidAmount", registration.paidAmount || "");
        urlParams.append("transactionId", registration.transactionId || "");
        urlParams.append("adminPaymentStatus", registration.adminPaymentStatus || "Unpaid");

        fetch(db.appsScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlParams.toString()
        }).catch((err) => {
          console.error("Delayed background Apps Script forwarding failed:", err);
        });
      } catch (err) {
        console.error("Crashed during background apps script forwarding:", err);
      }
    }

    res.json({ success: true, data: registration });
  });

  // API Route - Update a Registration
  app.put("/api/registrations/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const updatedData: RegistrationData = req.body;

    const index = db.registrations.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "রেজিস্ট্রেশন রেকর্ডটি খুঁজে পাওয়া যায়নি!" });
    }

    db.registrations[index] = { ...db.registrations[index], ...updatedData };
    saveDB(db);
    res.json({ success: true, data: db.registrations[index] });
  });

  // API Route - Delete a Registration
  app.delete("/api/registrations/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const initialLen = db.registrations.length;
    db.registrations = db.registrations.filter((r) => r.id !== id);
    
    if (db.registrations.length === initialLen) {
      return res.status(404).json({ error: "রেজিস্ট্রেশন রেকর্ডটি খুঁজে পাওয়া যায়নি!" });
    }

    saveDB(db);
    res.json({ success: true });
  });

  // API Route - Clear All Registrations
  app.post("/api/registrations/clear", requireAdmin, (req, res) => {
    db.registrations = [];
    saveDB(db);
    res.json({ success: true });
  });

  // Serve static assets / handle index rendering
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
