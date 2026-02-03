require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../src/admin/admin.model");

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const exists = await Admin.findOne({ email: "admin@college.com" });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  await Admin.create({
    name: "Super Admin",
    email: "admin@college.com",
    password: "Admin@123", // ❗ PLAIN TEXT ONLY
    role: "admin",
  });

  console.log("Admin created successfully");
  process.exit();
})();
