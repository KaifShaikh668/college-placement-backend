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
      selectedCount,
      monthlyData
    ] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),

      // ✅ Monthly student registration aggregation
      Student.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            students: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    // Convert month number to month name
    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedMonthlyData = monthlyData.map(item => ({
      name: monthNames[item._id],
      students: item.students
    }));

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount,
      monthlyData: formattedMonthlyData
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
