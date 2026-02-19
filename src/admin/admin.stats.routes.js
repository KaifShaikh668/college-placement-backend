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
      departmentPerformance
    ] = await Promise.all([

      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),

      // 🔥 Department Wise Placement Performance
      Student.aggregate([
        {
          $lookup: {
            from: "applications",
            localField: "_id",
            foreignField: "student",
            as: "applications"
          }
        },
        {
          $addFields: {
            department: {
              $ifNull: ["$department", "Unassigned"]
            }
          }
        },
        {
          $group: {
            _id: "$department",
            totalStudents: { $sum: 1 },
            totalApplications: { $sum: { $size: "$applications" } },
            selectedCount: {
              $sum: {
                $size: {
                  $filter: {
                    input: "$applications",
                    as: "app",
                    cond: { $eq: ["$$app.status", "Selected"] }
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            selectionRate: {
              $cond: [
                { $gt: ["$totalApplications", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$selectedCount", "$totalApplications"] },
                        100
                      ]
                    },
                    1
                  ]
                },
                0
              ]
            }
          }
        },
        { $sort: { totalStudents: -1 } }
      ])
    ]);

    // Overall selection rate
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
      departmentPerformance
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
