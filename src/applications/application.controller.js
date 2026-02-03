const Application = require("./application.model");
const Job = require("../jobs/job.model");

/* =========================
   APPLY JOB (STUDENT)
========================= */
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await Application.create({
      student: studentId,
      job: jobId,
      status: "Applied",
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already applied to this job" });
    }
    res.status(500).json({ message: "Apply job failed" });
  }
};

/* =========================
   GET MY APPLICATIONS (STUDENT)
========================= */
exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
    })
      .populate("job", "company role driveDate status")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("FETCH STUDENT APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to load applied jobs" });
  }
};

/* =========================
   GET ALL APPLICATIONS (ADMIN)
========================= */
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .populate("job", "company role")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("FETCH APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/* =========================
   UPDATE APPLICATION STATUS (ADMIN)
========================= */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("student", "name email")
      .populate("job", "company role");

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
