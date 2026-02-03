const express = require("express");
const router = express.Router();

const Student = require("./student.model");
const Application = require("../applications/application.model");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ==========================
   GET LOGGED-IN STUDENT PROFILE ✅
   GET /api/student/me
========================== */
router.get("/me", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    console.log("GET STUDENT PROFILE ERROR:", error);
    return res.status(500).json({ message: "Failed to load profile" });
  }
});

/* ==========================
   UPDATE LOGGED-IN STUDENT PROFILE ✅
   PUT /api/student/me
========================== */
router.put("/me", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Ensure nested objects exist (prevents crash)
    if (!student.profile) student.profile = {};
    if (!student.profile.address) student.profile.address = {};
    if (!student.profile.academics) student.profile.academics = {};

    const {
      gender,
      dob,
      aadhaar,
      street,
      city,
      state,
      pincode,
      ssc,
      hsc,
      graduation,
      cgpa,
      resumeName,
      profilePic,
    } = req.body;

    // ✅ Update personal fields
    student.profile.gender = gender ?? student.profile.gender;
    student.profile.dob = dob ?? student.profile.dob;
    student.profile.aadhaar = aadhaar ?? student.profile.aadhaar;

    // ✅ Update address fields
    student.profile.address.street = street ?? student.profile.address.street;
    student.profile.address.city = city ?? student.profile.address.city;
    student.profile.address.state = state ?? student.profile.address.state;
    student.profile.address.pincode = pincode ?? student.profile.address.pincode;

    // ✅ Update academic fields
    student.profile.academics.ssc = ssc ?? student.profile.academics.ssc;
    student.profile.academics.hsc = hsc ?? student.profile.academics.hsc;
    student.profile.academics.graduation =
      graduation ?? student.profile.academics.graduation;
    student.profile.academics.cgpa = cgpa ?? student.profile.academics.cgpa;

    // ✅ Update uploads
    student.profile.resumeName = resumeName ?? student.profile.resumeName;
    student.profile.profilePic = profilePic ?? student.profile.profilePic;

    await student.save();

    return res.json({
      message: "Profile updated successfully",
      student: await Student.findById(req.user.id).select("-password"),
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

/* ==========================
   STUDENT DASHBOARD STATS ✅
   GET /api/student/stats
========================== */
router.get("/stats", protect, async (req, res) => {
  try {
    const studentId = req.user.id;

    const applied = await Application.countDocuments({
      student: studentId,
      status: "Applied",
    });

    const shortlisted = await Application.countDocuments({
      student: studentId,
      status: "Shortlisted",
    });

    const selected = await Application.countDocuments({
      student: studentId,
      status: "Selected",
    });

    const rejected = await Application.countDocuments({
      student: studentId,
      status: "Rejected",
    });

    const totalApplications = await Application.countDocuments({
      student: studentId,
    });

    return res.json({
      totalApplications,
      applied,
      shortlisted,
      selected,
      rejected,
    });
  } catch (error) {
    console.log("STUDENT STATS ERROR:", error);
    return res.status(500).json({ message: "Failed to load stats" });
  }
});

/* ==========================
   GET ALL STUDENTS (ADMIN)
   GET /api/student
========================== */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(students);
  } catch (error) {
    console.log("FETCH STUDENTS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
});

/* ==========================
   UPDATE STUDENT (ADMIN) ✅
   PUT /api/student/:id
========================== */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, status } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(status !== undefined && { status }),
      },
      { new: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(updatedStudent);
  } catch (error) {
    console.log("UPDATE STUDENT ERROR:", error);
    return res.status(500).json({ message: "Failed to update student" });
  }
});

/* ==========================
   DELETE STUDENT (ADMIN)
   DELETE /api/student/:id
========================== */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log("DELETE STUDENT ERROR:", error);
    return res.status(500).json({ message: "Failed to delete student" });
  }
});

module.exports = router;
