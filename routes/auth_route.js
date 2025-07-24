const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const {
  authenticate,
  requireAdmin,
  requireTeacher,
  requireTeacherOrAdmin,
} = require("../middleware/auth.js");

// Signup
router.get("/signup", controller.auth.testingauth);
router.post("/signup", controller.auth.signup);

// Login
router.post("/login", controller.auth.login);

// Admin only routes
router.get(
  "/admin/users",
  authenticate,
  requireAdmin,
  controller.auth.GetAdminAllUsers
);

// Teacher and Admin routes
router.get(
  "/teacher/dashboard",
  authenticate,
  requireTeacherOrAdmin,
  (req, res) => {
    res.json({ message: "Teacher dashboard", user: req.user });
  }
);

// Admin route to change user roles
router.patch(
  "/admin/users/:userId/role",
  authenticate,
  requireAdmin,
  controller.auth.AdminChangeUserRole
);

router.get("/admin-only", authenticate, requireAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;
