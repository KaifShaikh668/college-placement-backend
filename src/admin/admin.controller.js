const Admin = require("./admin.model");
const Student = require("../student/student.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   ADMIN LOGIN
========================= */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* =========================
   ADMIN → GET ALL STUDENTS
========================= */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};
