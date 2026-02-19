const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const adminRoutes = require("./admin/admin.routes");
const adminStatsRoutes = require("./admin/admin.stats.routes");
const jobRoutes = require("./jobs/job.routes");
const applicationRoutes = require("./applications/application.routes");
const studentRoutes = require("./student/student.routes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ✅ Proper CORS configuration for production + local
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://college-placement-frontend-4fgw.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/notifications", notificationRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

module.exports = app;
