const express = require("express");
const router = express.Router();
const Student = require("../student/student.model");
const Job = require("../jobs/job.model");
const Application = require("../applications/application.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const openDrives = await Job.countDocuments({ status: "Open" });
    const totalApplications = await Application.countDocuments();

    res.json({
      totalStudents,
      openDrives,
      totalApplications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
