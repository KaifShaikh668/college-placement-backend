const express = require("express");
const router = express.Router();

const {
  createNotification,
  getStudentNotifications,
  markAsRead,
  getAllNotifications,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController");

// ✅ Your existing middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ✅ ADMIN ROUTES
router.get("/admin", protect, adminOnly, getAllNotifications);
router.post("/admin", protect, adminOnly, createNotification);
router.put("/admin/:id", protect, adminOnly, updateNotification);
router.delete("/admin/:id", protect, adminOnly, deleteNotification);

// ✅ STUDENT ROUTES
router.get("/student", protect, getStudentNotifications);
router.put("/student/:id/read", protect, markAsRead);

module.exports = router;
