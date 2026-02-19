const express = require("express");
const router = express.Router();
const Student = require("../student/student.model");
const Job = require("../jobs/job.model");
const Application = require("../applications/application.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, async (req, res) => {
  console.log("🔥 Admin stats route running");

  try {
    const [
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount,
      recentActivity
    ] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),

      // 🔥 Recent Activity
      Application.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("student", "name department")
        .populate("job", "company role")
    ]);

    const selectionRate =
      totalApplications > 0
        ? ((selectedCount / totalApplications) * 100).toFixed(1)
        : 0;

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount,
      selectionRate,
      recentActivity
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
