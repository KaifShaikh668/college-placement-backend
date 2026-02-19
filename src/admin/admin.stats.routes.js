const express = require("express");
const router = express.Router();
const Student = require("../student/student.model");
const Job = require("../jobs/job.model");
const Application = require("../applications/application.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, async (req, res) => {
  console.log("🔥 Clean Dashboard Route Running");

  try {
    const totalStudents = await Student.countDocuments();
    const totalApplications = await Application.countDocuments();
    const selectedCount = await Application.countDocuments({
      status: "Selected"
    });

    const selectionRate =
      totalApplications > 0
        ? ((selectedCount / totalApplications) * 100).toFixed(1)
        : 0;

    // Simple recent applications
    const recentApplications = await Application.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalStudents,
      totalApplications,
      selectedCount,
      selectionRate,
      recentApplications
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
