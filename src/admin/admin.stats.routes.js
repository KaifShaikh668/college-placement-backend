router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount,
      monthlyStudents
    ] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),
      Student.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr", "May",
      "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedMonthly = monthlyStudents.map(item => ({
      name: monthNames[item._id],
      students: item.count
    }));

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount,
      monthlyData: formattedMonthly
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});
