const express = require("express");
const router = express.Router();

const {
  applyJob,
  getStudentApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("./application.controller");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* =========================
   STUDENT ROUTES
========================= */

// ✅ Apply job
router.post("/:jobId", protect, applyJob);

// ✅ Student - my applications
router.get("/my", protect, getStudentApplications);

/* =========================
   ADMIN ROUTES
========================= */

// ✅ Admin - get all applications
router.get("/admin/all", protect, adminOnly, getAllApplications);

// ✅ Admin - update application status
router.put("/admin/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;
