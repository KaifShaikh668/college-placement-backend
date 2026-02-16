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
      monthlyData,
      recentStudents
    ] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),

      // Monthly aggregation
      Student.aggregate([
        {
          $match: {
            createdAt: { $type: "date" }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            students: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]),

      // Last 5 registered students
      Student.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name department createdAt")
    ]);

    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const monthlyRegistrations = monthlyData
      .filter(item => {
        return !(
          item._id.year === currentYear &&
          item._id.month === currentMonth &&
          item.students === 0
        );
      })
      .map(item => ({
        name: `${monthNames[item._id.month]} ${item._id.year}`,
        students: item.students
      }));

    // Calculate selection rate safely
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
      monthlyRegistrations,
      recentStudents
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
