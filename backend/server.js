require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const db = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { sanitizeInput } = require("./middleware/sanitize");
const { globalLimiter } = require("./config/rateLimits");

const contactRoutes = require("./routes/contactRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const sendMeetingRoute = require("./routes/sendMeeting");
const jobRoutes = require("./routes/jobRoutes");
const industryRoutes = require("./routes/industryRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const faqRoutes = require("./routes/faqRoutes");
const teamRoutes = require("./routes/teamRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const siteSettingRoutes = require("./routes/siteSettingRoutes");
const navigationRoutes = require("./routes/navigationRoutes");
const partnerLogoRoutes = require("./routes/partnerLogoRoutes");
const processStepRoutes = require("./routes/processStepRoutes");
const companyStatsRoutes = require("./routes/companyStatsRoutes");
const trustPointRoutes = require("./routes/trustPointRoutes");
const { generateSitemap } = require("./controllers/sitemapController");

const app = express();



app.set("trust proxy", 1);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", {
    skip: (req) => req.url === "/api/health",
  }));
} else {
  app.use(morgan("dev"));
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  next();
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({ extended: true, limit: "10kb" }),
);

// Serve static files from public folder (including uploads)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(
  compression({
    threshold: 1024,
  }),
);

app.use(sanitizeInput);
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SRJ Global API Server is running",
    healthCheck: "/api/health",
    documentation: "/api/sitemap.xml",
  });
});

app.get("/api/health", async (req, res) => {
  let dbStatus = "disconnected";

  try {
    await db.getConnection();
    dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    node: process.version,
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/contact", contactRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/settings", siteSettingRoutes);
app.use("/api/navigation", navigationRoutes);
app.use("/api/partner-logos", partnerLogoRoutes);
app.use("/api/process-steps", processStepRoutes);
app.use("/api/company-stats", companyStatsRoutes);
app.use("/api/trust-points", trustPointRoutes);
app.use("/api", sendMeetingRoute);

app.get("/sitemap.xml", generateSitemap);
app.get("/api/sitemap.xml", generateSitemap);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

let server;

db.getConnection()
  .then(() => {
    console.log("MySQL connected successfully");

    const PORT = process.env.PORT || 5000;

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("[FATAL] Unhandled Rejection:", err.message);
  console.error(err.stack);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");

  if (server) {
    server.close(() => {
      db.end().catch(() => {});
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");

  if (server) {
    server.close(() => {
      db.end().catch(() => {});
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
