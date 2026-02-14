const express = require("express");
const router = express.Router();
const Student = require("../student/student.model");
const Job = require("../jobs/job.model");
const Application = require("../applications/application.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount
    ] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" })
    ]);

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
