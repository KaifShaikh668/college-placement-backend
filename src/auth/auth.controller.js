const Student = require("../student/student.model");
const Admin = require("../admin/admin.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

/* =========================
   HELPERS
========================= */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidStudentId = (id) => /^[0-9]{7}$/.test(id);

const isValidPassword = (password) => {
  if (password.length < 6) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

/* =========================
   REGISTER STUDENT (ACTIVATE ACCOUNT)
========================= */
exports.register = async (req, res) => {
  try {
    const { studentId, email, password } = req.body;

    if (!studentId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedStudentId = String(studentId).trim();
    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanPassword = String(password).trim();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidStudentId(normalizedStudentId)) {
      return res.status(400).json({
        message: "Student ID must be exactly 7 digits",
      });
    }

    if (!isValidPassword(cleanPassword)) {
      return res.status(400).json({
        message:
          "Password must be minimum 6 characters and contain letters + numbers",
      });
    }

    // ✅ Student must already exist in DB (Pre-added by admin)
    const student = await Student.findOne({ studentId: normalizedStudentId });

    if (!student) {
      return res.status(400).json({
        message: "Student ID not found. Contact Admin.",
      });
    }

    // ✅ prevent duplicate activation
    if (student.isRegistered) {
      return res.status(400).json({
        message: "Student already registered. Please login.",
      });
    }

    // ✅ if this student already has an email in DB, it must match
    if (student.email && student.email.length > 0 && student.email !== normalizedEmail) {
      return res.status(400).json({
        message: "Email does not match Student ID. Contact Admin.",
      });
    }

    // ✅ prevent other students from using same email
    const emailExists = await Student.findOne({
      email: normalizedEmail,
      studentId: { $ne: normalizedStudentId },
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    student.email = normalizedEmail;
    student.password = hashedPassword;
    student.isRegistered = true;

    await student.save();

    return res.status(201).json({
      message: "Registration successful. Please login now.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================
   LOGIN (AUTO-DETECT ROLE)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanPassword = String(password).trim();

    /* ---------- CHECK ADMIN FIRST ---------- */
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (admin) {
      const isMatch = await bcrypt.compare(cleanPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken({
        id: admin._id,
        role: "admin",
      });

      return res.json({
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });
    }

    /* ---------- OTHERWISE STUDENT ---------- */
    const student = await Student.findOne({ email: normalizedEmail });

    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Not activated yet
    if (!student.isRegistered || !student.password) {
      return res.status(400).json({
        message: "Account not activated. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(cleanPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      id: student._id,
      role: "student",
    });

    return res.json({
      token,
      user: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
        contactNumber: student.contactNumber,
        year: student.year,
        role: "student",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};
