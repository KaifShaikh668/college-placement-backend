const express = require("express");
const router = express.Router();

const { loginAdmin, getAllStudents } = require("./admin.controller");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ADMIN LOGIN
router.post("/login", loginAdmin);

// ADMIN → GET ALL STUDENTS
router.get("/students", protect, adminOnly, getAllStudents);

module.exports = router;
