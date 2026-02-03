const Job = require("../jobs/job.model");
const Application = require("../applications/application.model");

/* =========================
   STUDENT DASHBOARD STATS
========================= */
exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    const appliedJobs = await Application.countDocuments({ student: studentId });

    const openDrives = await Job.countDocuments({ status: "Open" });

    // ✅ Dummy notifications for now (until we build notifications system)
    const notifications = 0;

    res.json({
      appliedJobs,
      openDrives,
      notifications,
    });
  } catch (error) {
    console.error("STUDENT STATS ERROR:", error);
    res.status(500).json({ message: "Failed to load stats" });
  }
};
