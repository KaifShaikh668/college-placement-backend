const Job = require("./job.model");

/* =========================
   CREATE JOB (ADMIN ONLY)
========================= */
exports.createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      location,
      salary,
      eligibility,
      description,
      driveDate,
    } = req.body;

    if (
      !company ||
      !role ||
      !location ||
      !salary ||
      !eligibility ||
      !description ||
      !driveDate
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const job = await Job.create({
      company,
      role,
      location,
      salary,
      eligibility,
      description,
      driveDate,
      createdBy: req.user.id, // ✅ admin id from token
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    return res.status(500).json({
      message: "Failed to create job",
    });
  }
};

/* =========================
   VIEW JOBS (STUDENT + ADMIN)
========================= */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    return res.json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};
