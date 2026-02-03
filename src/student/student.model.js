const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },

    // ✅ Pre-added by admin
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },

    // ✅ Filled during activation
    email: { type: String, default: "", trim: true },
    password: { type: String, default: "" },
    isRegistered: { type: Boolean, default: false },

    status: { type: String, default: "Active" },

    /* ✅ EXTRA PROFILE FIELDS (Student fills later) */
    profile: {
      gender: { type: String, default: "" },
      dob: { type: String, default: "" },
      aadhaar: { type: String, default: "" },

      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
      },

      academics: {
        ssc: { type: String, default: "" },
        hsc: { type: String, default: "" },
        graduation: { type: String, default: "" },
        cgpa: { type: String, default: "" },
      },

      resumeName: { type: String, default: "" },
      profilePic: { type: String, default: "" }, // base64 image (for project demo)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
