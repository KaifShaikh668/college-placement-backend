const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const adminRoutes = require("./admin/admin.routes");
const adminStatsRoutes = require("./admin/admin.stats.routes"); // ✅ ADDED
const jobRoutes = require("./jobs/job.routes");
const applicationRoutes = require("./applications/application.routes");
const studentRoutes = require("./student/student.routes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminStatsRoutes); // ✅ THIS MAKES /admin/stats WORK
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/notifications", notificationRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

module.exports = app;
