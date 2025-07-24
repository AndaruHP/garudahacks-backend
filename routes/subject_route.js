const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

// Signup
// router.get("/signup", controller.auth.testingauth);
// router.post("/signup", controller.auth.signup);

router.get("/GetSubjects", controller.subject.GetSubjects);

module.exports = router;
