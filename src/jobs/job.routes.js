const express = require("express");
const router = express.Router();
const Job = require("./job.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* =========================
   STUDENT → GET OPEN JOBS
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/* =========================
   ADMIN → GET ALL JOBS
========================= */
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/* =========================
   ADMIN → CREATE JOB
========================= */
router.post("/admin", protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* =========================
   ADMIN → UPDATE JOB
========================= */
router.put("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* =========================
   ADMIN → DELETE JOB
========================= */
router.delete("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
