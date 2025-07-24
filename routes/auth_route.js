const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const controller = require("../controllers/index");

// Signup
router.get("/signup", controller.auth.testingauth);

router.post("/signup", controller.auth.signup);

// Login
router.post("/login", controller.auth.login);

// OAuth
router.post("/oauth/:provider", controller.auth.oauth);

module.exports = router;
