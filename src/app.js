const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const adminRoutes = require("./admin/admin.routes");
const jobRoutes = require("./jobs/job.routes");
const applicationRoutes = require("./applications/application.routes");
const studentRoutes = require("./student/student.routes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

module.exports = app;
