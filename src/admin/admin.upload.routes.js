const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const Student = require("../student/student.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  dest: "uploads/",
});

/* =========================
   BASIC CSV UPLOAD
   POST /api/admin/upload-csv
========================= */
router.post(
  "/upload-csv",
  protect,
  adminOnly,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const students = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          students.push({
            studentId: row.studentId,
            name: row.name,
            department: row.department,
            year: row.year,
            contactNumber: row.contactNumber,
            isRegistered: false,
          });
        })
        .on("end", async () => {
          try {
            await Student.insertMany(students);

            fs.unlinkSync(req.file.path);

            return res.json({
              message: `${students.length} students uploaded successfully`,
            });
          } catch (error) {
            return res.status(500).json({
              message: "Error inserting students",
              error: error.message,
            });
          }
        });
    } catch (error) {
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;