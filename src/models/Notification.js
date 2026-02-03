const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ who created it (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    // ✅ Optional: for future (send to specific department/year)
    targetDepartment: {
      type: String,
      default: "All",
    },
    targetYear: {
      type: String,
      default: "All",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
