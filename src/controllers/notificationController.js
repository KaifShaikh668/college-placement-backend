const Notification = require("../models/Notification");
const StudentNotification = require("../models/StudentNotification");
const Student = require("../student/student.model");

// ✅ ADMIN: Create notification + assign to students
exports.createNotification = async (req, res) => {
  try {
    const { title, message, targetDepartment, targetYear } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      title,
      message,
      createdBy: req.user?.id || null,
      targetDepartment: targetDepartment || "All",
      targetYear: targetYear || "All",
    });

    // ✅ Find all students (filter optional)
    const query = {};

    // ⚠️ Your Student model currently has no department/year fields
    // So we keep query empty for now = send to all students
    const students = await Student.find(query).select("_id");

    const bulkData = students.map((s) => ({
      student: s._id,
      notification: notification._id,
      status: "new",
    }));

    if (bulkData.length > 0) {
      await StudentNotification.insertMany(bulkData);
    }

    return res.status(201).json({
      message: "Notification created & sent successfully",
      notification,
      totalStudents: bulkData.length,
    });
  } catch (error) {
    console.error("createNotification error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ ADMIN: Get all notifications (for Manage Notices page)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    console.error("getAllNotifications error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ ADMIN: Update notification title/message
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { title, message },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({
      message: "Notification updated successfully",
      notification: updated,
    });
  } catch (error) {
    console.error("updateNotification error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ ADMIN: Delete notification + linked student notifications
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // ✅ Remove student mappings too
    await StudentNotification.deleteMany({ notification: id });

    return res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("deleteNotification error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ STUDENT: Get notifications of logged-in student
exports.getStudentNotifications = async (req, res) => {
  try {
    const studentId = req.user?.id;

    const data = await StudentNotification.find({ student: studentId })
      .populate("notification")
      .sort({ createdAt: -1 });

    const formatted = data.map((item) => ({
      _id: item._id,
      status: item.status,
      createdAt: item.createdAt,
      notificationId: item.notification?._id,
      title: item.notification?.title,
      message: item.notification?.message,
      time: item.notification?.createdAt,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("getStudentNotifications error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ STUDENT: Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const { id } = req.params;

    const found = await StudentNotification.findOne({
      _id: id,
      student: studentId,
    });

    if (!found) {
      return res.status(404).json({ message: "Notification not found" });
    }

    found.status = "read";
    await found.save();

    return res.json({ message: "Marked as read successfully" });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
