var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_vite = require("vite");
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "database.json");
function hashPassword(str) {
  return import_crypto.default.createHash("sha256").update(str).digest("hex");
}
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
var defaultPasswordHash = hashPassword("marketingtour2026");
var defaultMockData = [
  {
    id: "mock_1",
    timestamp: "\u09E7\u09EA/\u09EC/\u09E8\u09E6\u09E8\u09EC, \u09B8\u0995\u09BE\u09B2 \u09E7\u09E6:\u09E7\u09EE:\u09E9\u09E6",
    name: "\u099C\u09BF \u098F\u09AE \u09B0\u09AC\u09BF\u0989\u09B2 \u09B9\u09BE\u09B8\u09BE\u09A8",
    phone: "01964334759",
    participation: "yes",
    hasFamily: "yes",
    familyCount: 1,
    emergencyPhone: "01712345678",
    notes: "\u0996\u09C1\u09B2\u09A8\u09BE \u09B8\u09CD\u099F\u09C7\u09B6\u09A8 \u09A5\u09C7\u0995\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09AF\u09BE\u09A4\u09CD\u09B0\u09BE \u0995\u09B0\u09AC\u09CB \u098F\u09AC\u0982 \u09AB\u09BF\u09B0\u09AC\u09CB\u0964 \u0996\u09BE\u09AC\u09BE\u09B0\u09C7\u09B0 \u099D\u09BE\u09B2 \u0995\u09AE \u09B9\u09B2\u09C7 \u09AD\u09BE\u09B2\u09CB \u09B9\u09DF\u0964",
    agreement: true,
    paidAlready: "no",
    adminPaymentStatus: "Unpaid"
  },
  {
    id: "mock_2",
    timestamp: "\u09E7\u09EA/\u09EC/\u09E8\u09E6\u09E8\u09EC, \u09B8\u0995\u09BE\u09B2 \u09E7\u09E6:\u09E8\u09EB:\u09EA\u09EB",
    name: "\u09AA\u09BE\u09AA\u09DC\u09BF \u099A\u0995\u09CD\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0",
    phone: "01911122233",
    participation: "yes",
    hasFamily: "no",
    familyCount: 0,
    emergencyPhone: "01888777666",
    notes: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F\u09BF\u0982 \u09AC\u09BF\u09AD\u09BE\u0997\u09C7\u09B0 (\u09E8\u09DF \u09AC\u09B0\u09CD\u09B7) \u09B8\u0995\u09B2\u09C7\u09B0 \u09B8\u09CD\u09AC\u09A4\u0983\u09B8\u09CD\u09AB\u09C2\u09B0\u09CD\u09A4 \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09BE\u09AE\u09A8\u09BE \u0995\u09B0\u099B\u09BF!",
    agreement: true,
    paidAlready: "no",
    adminPaymentStatus: "Unpaid"
  }
];
function loadDB() {
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const content = import_fs.default.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        passwordHash: parsed.passwordHash || defaultPasswordHash,
        appsScriptUrl: parsed.appsScriptUrl || "",
        registrations: Array.isArray(parsed.registrations) ? parsed.registrations : defaultMockData
      };
    }
  } catch (error) {
    console.error("Error loading database file, falling back to default:", error);
  }
  const initialDB = {
    passwordHash: defaultPasswordHash,
    appsScriptUrl: "",
    registrations: defaultMockData
  };
  saveDB(initialDB);
  return initialDB;
}
function saveDB(data) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database file:", error);
  }
}
var activeServerSessions = /* @__PURE__ */ new Set();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.use(import_express.default.urlencoded({ extended: true }));
  let db = loadDB();
  const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "\u0985\u09A8\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6! \u09A6\u09DF\u09BE \u0995\u09B0\u09C7 \u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1\u09C7 \u0986\u09AC\u09BE\u09B0 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" });
    }
    const token = authHeader.substring(7);
    if (!activeServerSessions.has(token)) {
      return res.status(401).json({ error: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09C7\u09B6\u09A8\u099F\u09BF \u09B6\u09C7\u09B7 \u09B9\u09DF\u09C7 \u0997\u09C7\u099B\u09C7\u0964 \u09A6\u09DF\u09BE \u0995\u09B0\u09C7 \u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1\u09C7 \u09AA\u09C1\u09A8\u09B0\u09BE\u09DF \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" });
    }
    next();
  };
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });
  app.get("/api/public-config", (req, res) => {
    res.json({
      appsScriptUrl: db.appsScriptUrl
    });
  });
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "\u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u0986\u09AC\u09B6\u09CD\u09AF\u0995!" });
    }
    const hashedInput = hashPassword(password);
    if (hashedInput === db.passwordHash) {
      const token = "token_" + import_crypto.default.randomBytes(32).toString("hex");
      activeServerSessions.add(token);
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ error: "\u09AD\u09C1\u09B2 \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1! \u09A6\u09DF\u09BE \u0995\u09B0\u09C7 \u09B8\u09A0\u09BF\u0995 \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u099F\u09BE\u0987\u09AA \u0995\u09B0\u09C1\u09A8\u0964" });
    }
  });
  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      activeServerSessions.delete(token);
    }
    res.json({ success: true });
  });
  app.get("/api/admin/config", requireAdmin, (req, res) => {
    res.json({
      appsScriptUrl: db.appsScriptUrl
    });
  });
  app.post("/api/admin/config", requireAdmin, (req, res) => {
    const { appsScriptUrl } = req.body;
    db.appsScriptUrl = appsScriptUrl || "";
    saveDB(db);
    res.json({ success: true, appsScriptUrl: db.appsScriptUrl });
  });
  app.post("/api/admin/change-password", requireAdmin, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "\u09AA\u09C1\u09B0\u09BE\u09A4\u09A8 \u0993 \u09A8\u09A4\u09C1\u09A8 \u0989\u09AD\u09DF \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u0986\u09AC\u09B6\u09CD\u09AF\u0995!" });
    }
    if (hashPassword(oldPassword) !== db.passwordHash) {
      return res.status(400).json({ error: "\u09AA\u09C1\u09B0\u09BE\u09A4\u09A8 \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1\u099F\u09BF \u09B8\u09A0\u09BF\u0995 \u09A8\u09DF!" });
    }
    db.passwordHash = hashPassword(newPassword);
    saveDB(db);
    res.json({ success: true, message: "\u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7!" });
  });
  app.get("/api/registrations", requireAdmin, (req, res) => {
    res.json(db.registrations);
  });
  app.post("/api/registrations/submit", async (req, res) => {
    const registration = req.body;
    if (!registration || !registration.id || !registration.name || !registration.phone) {
      return res.status(400).json({ error: "\u0985\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09C7\u09B6\u09A8 \u09A1\u09C7\u099F\u09BE!" });
    }
    db.registrations.unshift(registration);
    saveDB(db);
    if (db.appsScriptUrl) {
      try {
        const urlParams = new URLSearchParams();
        urlParams.append("timestamp", registration.timestamp);
        urlParams.append("name", registration.name);
        urlParams.append("phone", registration.phone);
        urlParams.append("participation", registration.participation === "yes" ? "\u09B9\u09CD\u09AF\u09BE\u0981" : registration.participation === "no" ? "\u09A8\u09BE" : "\u098F\u0996\u09A8\u0993 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09A8\u0987");
        urlParams.append("hasFamily", registration.hasFamily === "yes" ? "\u09B9\u09CD\u09AF\u09BE\u0981" : "\u09A8\u09BE");
        urlParams.append("familyCount", String(registration.familyCount));
        urlParams.append("emergencyPhone", registration.emergencyPhone);
        urlParams.append("notes", registration.notes);
        urlParams.append("paidAlready", registration.paidAlready === "yes" ? "\u09B9\u09CD\u09AF\u09BE\u0981" : "\u09A8\u09BE");
        urlParams.append("paymentMethod", registration.paymentMethod || "");
        urlParams.append("paidAmount", registration.paidAmount || "");
        urlParams.append("transactionId", registration.transactionId || "");
        urlParams.append("adminPaymentStatus", registration.adminPaymentStatus || "Unpaid");
        fetch(db.appsScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
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
  app.put("/api/registrations/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const index = db.registrations.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "\u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09C7\u09B6\u09A8 \u09B0\u09C7\u0995\u09B0\u09CD\u09A1\u099F\u09BF \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF!" });
    }
    db.registrations[index] = { ...db.registrations[index], ...updatedData };
    saveDB(db);
    res.json({ success: true, data: db.registrations[index] });
  });
  app.delete("/api/registrations/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const initialLen = db.registrations.length;
    db.registrations = db.registrations.filter((r) => r.id !== id);
    if (db.registrations.length === initialLen) {
      return res.status(404).json({ error: "\u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09C7\u09B6\u09A8 \u09B0\u09C7\u0995\u09B0\u09CD\u09A1\u099F\u09BF \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF!" });
    }
    saveDB(db);
    res.json({ success: true });
  });
  app.post("/api/registrations/clear", requireAdmin, (req, res) => {
    db.registrations = [];
    saveDB(db);
    res.json({ success: true });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
